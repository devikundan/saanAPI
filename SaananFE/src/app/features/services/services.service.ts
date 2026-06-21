import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { ServiceResponse } from '@core/models/service.model';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.services}`;

  getActiveServices(): Observable<ApiResponse<ServiceResponse[]>> {
    return this.http.get<ApiResponse<ServiceResponse[]>>(this.baseUrl);
  }

  getBySlug(slug: string): Observable<ApiResponse<ServiceResponse>> {
    return this.http.get<ApiResponse<ServiceResponse>>(`${this.baseUrl}/${slug}`);
  }
}
