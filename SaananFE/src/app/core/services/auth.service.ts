import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { TokenService } from './token.service';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest, LoginResponse, RefreshTokenRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  private readonly _currentUser = new BehaviorSubject<{ fullName: string; email: string } | null>(
    this.loadUserFromStorage()
  );
  readonly currentUser$ = this._currentUser.asObservable();

  login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(
        `${environment.apiBaseUrl}${API_ENDPOINTS.auth.login}`,
        request
      )
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.tokenService.setTokens(
              response.data.accessToken,
              response.data.refreshToken,
              response.data.expiresAt
            );
            const user = { fullName: response.data.fullName, email: response.data.email };
            localStorage.setItem('current_user', JSON.stringify(user));
            this._currentUser.next(user);
          }
        })
      );
  }

  refreshToken(): Observable<ApiResponse<LoginResponse>> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return of({ success: false, message: 'No refresh token', data: null, errors: null });
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http
      .post<ApiResponse<LoginResponse>>(
        `${environment.apiBaseUrl}${API_ENDPOINTS.auth.refreshToken}`,
        request
      )
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.tokenService.setTokens(
              response.data.accessToken,
              response.data.refreshToken,
              response.data.expiresAt
            );
          }
        }),
        catchError(() => {
          this.logout();
          return of({ success: false, message: 'Token refresh failed', data: null, errors: null });
        })
      );
  }

  logout(): void {
    this.tokenService.clearTokens();
    localStorage.removeItem('current_user');
    this._currentUser.next(null);
    this.router.navigate(['/admin/login']);
  }

  get isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }

  private loadUserFromStorage(): { fullName: string; email: string } | null {
    const stored = localStorage.getItem('current_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }
}
