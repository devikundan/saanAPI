import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { NewsletterSubscribeRequest, NewsletterConfirmation } from '@core/models/newsletter.model';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.newsletter}`;

  subscribe(request: NewsletterSubscribeRequest): Observable<ApiResponse<NewsletterConfirmation>> {
    return this.http.post<ApiResponse<NewsletterConfirmation>>(`${this.baseUrl}/subscribe`, request);
  }

  unsubscribe(email: string): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`, {});
  }
}
