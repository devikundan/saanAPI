import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { FaqResponse } from '@core/models/faq.model';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.faqs}`;

  getActiveFaqs(): Observable<ApiResponse<FaqResponse[]>> {
    return this.http.get<ApiResponse<FaqResponse[]>>(this.baseUrl);
  }
}
