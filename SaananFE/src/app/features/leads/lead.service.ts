import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { CreateLeadRequest, LeadConfirmation } from '@core/models/lead.model';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.leads}`;

  submitLead(request: CreateLeadRequest): Observable<ApiResponse<LeadConfirmation>> {
    return this.http.post<ApiResponse<LeadConfirmation>>(this.baseUrl, request);
  }
}
