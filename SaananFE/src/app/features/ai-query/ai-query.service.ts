import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { ClassifyQueryRequest, QueryClassificationResponse } from '@core/models/query-classification.model';

@Injectable({ providedIn: 'root' })
export class AiQueryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.admin.queryClassification}`;

  classifyQuery(request: ClassifyQueryRequest): Observable<ApiResponse<QueryClassificationResponse>> {
    return this.http.post<ApiResponse<QueryClassificationResponse>>(`${this.baseUrl}/classify`, request);
  }
}
