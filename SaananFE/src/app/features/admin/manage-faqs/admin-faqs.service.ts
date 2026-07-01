import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { FaqResponse } from '@core/models/faq.model';

export interface CreateFaqRequest {
  question: string;
  answer: string;
  category: string | null;
  displayOrder: number;
  isActive: boolean;
}

export type UpdateFaqRequest = CreateFaqRequest;

@Injectable({ providedIn: 'root' })
export class AdminFaqsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.admin.faqs}`;

  getAll(page = 1, pageSize = 10): Observable<ApiResponse<PaginatedResult<FaqResponse>>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<PaginatedResult<FaqResponse>>>(this.baseUrl, { params });
  }

  create(request: CreateFaqRequest): Observable<ApiResponse<FaqResponse>> {
    return this.http.post<ApiResponse<FaqResponse>>(this.baseUrl, request);
  }

  update(id: string, request: UpdateFaqRequest): Observable<ApiResponse<FaqResponse>> {
    return this.http.put<ApiResponse<FaqResponse>>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }
}
