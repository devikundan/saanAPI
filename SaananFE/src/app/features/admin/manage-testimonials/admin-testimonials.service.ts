import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { TestimonialResponse } from '@core/models/testimonial.model';

export interface CreateTestimonialRequest {
  clientName: string;
  clientTitle: string | null;
  clientImageUrl: string | null;
  content: string;
  rating: number;
  isActive: boolean;
  displayOrder: number;
}

export type UpdateTestimonialRequest = CreateTestimonialRequest;

@Injectable({ providedIn: 'root' })
export class AdminTestimonialsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.admin.testimonials}`;

  getAll(page = 1, pageSize = 10): Observable<ApiResponse<PaginatedResult<TestimonialResponse>>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<PaginatedResult<TestimonialResponse>>>(this.baseUrl, { params });
  }

  create(request: CreateTestimonialRequest): Observable<ApiResponse<TestimonialResponse>> {
    return this.http.post<ApiResponse<TestimonialResponse>>(this.baseUrl, request);
  }

  update(id: string, request: UpdateTestimonialRequest): Observable<ApiResponse<TestimonialResponse>> {
    return this.http.put<ApiResponse<TestimonialResponse>>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }
}
