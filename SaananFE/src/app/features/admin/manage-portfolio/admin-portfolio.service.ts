import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { PortfolioResponse } from '@core/models/portfolio.model';

export interface CreatePortfolioRequest {
  title: string;
  slug: string | null;
  description: string;
  clientName: string | null;
  projectUrl: string | null;
  thumbnailUrl: string | null;
  technologies: string | null;
  completedAt: string | null;
  isActive: boolean;
  displayOrder: number;
}

export type UpdatePortfolioRequest = CreatePortfolioRequest;

@Injectable({ providedIn: 'root' })
export class AdminPortfolioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.admin.portfolio}`;

  getAll(page = 1, pageSize = 10): Observable<ApiResponse<PaginatedResult<PortfolioResponse>>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<PaginatedResult<PortfolioResponse>>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<PortfolioResponse>> {
    return this.http.get<ApiResponse<PortfolioResponse>>(`${this.baseUrl}/${id}`);
  }

  create(request: CreatePortfolioRequest): Observable<ApiResponse<PortfolioResponse>> {
    return this.http.post<ApiResponse<PortfolioResponse>>(this.baseUrl, request);
  }

  update(id: string, request: UpdatePortfolioRequest): Observable<ApiResponse<PortfolioResponse>> {
    return this.http.put<ApiResponse<PortfolioResponse>>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }
}
