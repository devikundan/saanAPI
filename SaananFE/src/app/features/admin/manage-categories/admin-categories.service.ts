import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { PaginatedResult } from '@core/models/paginated-result.model';

export interface ServiceCategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceCategoryRequest {
  name: string;
  slug: string | null;
  description: string | null;
  iconUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

export type UpdateServiceCategoryRequest = CreateServiceCategoryRequest;

@Injectable({ providedIn: 'root' })
export class AdminCategoriesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.admin.serviceCategories}`;

  getAll(page = 1, pageSize = 10): Observable<ApiResponse<PaginatedResult<ServiceCategoryResponse>>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<PaginatedResult<ServiceCategoryResponse>>>(this.baseUrl, { params });
  }

  create(request: CreateServiceCategoryRequest): Observable<ApiResponse<ServiceCategoryResponse>> {
    return this.http.post<ApiResponse<ServiceCategoryResponse>>(this.baseUrl, request);
  }

  update(id: string, request: UpdateServiceCategoryRequest): Observable<ApiResponse<ServiceCategoryResponse>> {
    return this.http.put<ApiResponse<ServiceCategoryResponse>>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }
}
