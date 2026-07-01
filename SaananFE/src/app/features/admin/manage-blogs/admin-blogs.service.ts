import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { BlogResponse, BlogStatus } from '@core/models/blog.model';

export interface CreateBlogRequest {
  title: string;
  slug: string | null;
  summary: string | null;
  content: string;
  featuredImageUrl: string | null;
  author: string;
  tags: string | null;
  status: BlogStatus;
}

export type UpdateBlogRequest = CreateBlogRequest;

@Injectable({ providedIn: 'root' })
export class AdminBlogsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.admin.blogs}`;

  getAll(page = 1, pageSize = 10): Observable<ApiResponse<PaginatedResult<BlogResponse>>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<PaginatedResult<BlogResponse>>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<BlogResponse>> {
    return this.http.get<ApiResponse<BlogResponse>>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateBlogRequest): Observable<ApiResponse<BlogResponse>> {
    return this.http.post<ApiResponse<BlogResponse>>(this.baseUrl, request);
  }

  update(id: string, request: UpdateBlogRequest): Observable<ApiResponse<BlogResponse>> {
    return this.http.put<ApiResponse<BlogResponse>>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }
}
