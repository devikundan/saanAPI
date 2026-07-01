import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { LeadResponse } from '@core/models/lead.model';

export interface UpdateLeadStatusRequest {
  status: number;
  adminNotes: string | null;
}

export const LEAD_STATUSES = ['New', 'Contacted', 'InProgress', 'Converted', 'Closed', 'Spam'] as const;

@Injectable({ providedIn: 'root' })
export class AdminLeadsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.admin.leads}`;

  getAll(page = 1, pageSize = 10): Observable<ApiResponse<PaginatedResult<LeadResponse>>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<PaginatedResult<LeadResponse>>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<LeadResponse>> {
    return this.http.get<ApiResponse<LeadResponse>>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: string, request: UpdateLeadStatusRequest): Observable<ApiResponse<LeadResponse>> {
    return this.http.put<ApiResponse<LeadResponse>>(`${this.baseUrl}/${id}/status`, request);
  }

  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }
}
