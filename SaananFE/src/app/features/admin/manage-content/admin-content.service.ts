import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';

export interface ContentResponse {
  id: string;
  sectionKey: string;
  title: string;
  body: string | null;
  imageUrl: string | null;
  metaData: string | null;
  updatedAt: string;
}

export interface UpdateContentRequest {
  title: string;
  body: string | null;
  imageUrl: string | null;
  metaData: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminContentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.admin.content}`;

  getAll(): Observable<ApiResponse<ContentResponse[]>> {
    return this.http.get<ApiResponse<ContentResponse[]>>(this.baseUrl);
  }

  update(id: string, request: UpdateContentRequest): Observable<ApiResponse<ContentResponse>> {
    return this.http.put<ApiResponse<ContentResponse>>(`${this.baseUrl}/${id}`, request);
  }
}
