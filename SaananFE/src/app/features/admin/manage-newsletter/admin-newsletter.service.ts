import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { PaginatedResult } from '@core/models/paginated-result.model';

export interface NewsletterSubscriberResponse {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminNewsletterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.admin.newsletter}`;

  getAll(page = 1, pageSize = 10): Observable<ApiResponse<PaginatedResult<NewsletterSubscriberResponse>>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<PaginatedResult<NewsletterSubscriberResponse>>>(this.baseUrl, { params });
  }

  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }
}
