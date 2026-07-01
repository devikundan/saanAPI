import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { ServiceResponse } from '@core/models/service.model';

export interface CreateServiceRequest {
  title: string;
  slug: string | null;
  shortDescription: string;
  detailedDescription: string;
  iconUrl: string | null;
  serviceCategoryId: string;
  displayOrder: number;
  isActive: boolean;
}

export type UpdateServiceRequest = CreateServiceRequest;

@Injectable({ providedIn: 'root' })
export class AdminServicesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.admin.services}`;

  getAll(page = 1, pageSize = 10): Observable<ApiResponse<PaginatedResult<ServiceResponse>>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<PaginatedResult<ServiceResponse>>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<ServiceResponse>> {
    return this.http.get<ApiResponse<ServiceResponse>>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateServiceRequest): Observable<ApiResponse<ServiceResponse>> {
    return this.http.post<ApiResponse<ServiceResponse>>(this.baseUrl, request);
  }

  update(id: string, request: UpdateServiceRequest): Observable<ApiResponse<ServiceResponse>> {
    return this.http.put<ApiResponse<ServiceResponse>>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }
}
