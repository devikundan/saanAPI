import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { QueryClassificationResponse } from '@core/models/query-classification.model';

@Injectable({ providedIn: 'root' })
export class AdminQueryClassificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.admin.queryClassification}`;

  getRecent(count = 20): Observable<ApiResponse<QueryClassificationResponse[]>> {
    return this.http.get<ApiResponse<QueryClassificationResponse[]>>(`${this.baseUrl}/recent?count=${count}`);
  }

  getById(id: string): Observable<ApiResponse<QueryClassificationResponse>> {
    return this.http.get<ApiResponse<QueryClassificationResponse>>(`${this.baseUrl}/${id}`);
  }
}
