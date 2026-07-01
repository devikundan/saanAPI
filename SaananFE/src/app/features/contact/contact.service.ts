import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { CreateContactMessageRequest, ContactMessageConfirmation } from '@core/models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.contactMessages}`;

  submitMessage(request: CreateContactMessageRequest): Observable<ApiResponse<ContactMessageConfirmation>> {
    return this.http.post<ApiResponse<ContactMessageConfirmation>>(this.baseUrl, request);
  }
}
