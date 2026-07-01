import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { PortfolioResponse } from '@core/models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.portfolio}`;

  getActiveProjects(): Observable<ApiResponse<PortfolioResponse[]>> {
    return this.http.get<ApiResponse<PortfolioResponse[]>>(this.baseUrl);
  }

  getBySlug(slug: string): Observable<ApiResponse<PortfolioResponse>> {
    return this.http.get<ApiResponse<PortfolioResponse>>(`${this.baseUrl}/${slug}`);
  }
}
