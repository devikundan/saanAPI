import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { BlogListResponse, BlogResponse } from '@core/models/blog.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.blogs}`;

  getPublishedBlogs(page: number, pageSize: number): Observable<ApiResponse<PaginatedResult<BlogListResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResult<BlogListResponse>>>(this.baseUrl, { params });
  }

  getBySlug(slug: string): Observable<ApiResponse<BlogResponse>> {
    return this.http.get<ApiResponse<BlogResponse>>(`${this.baseUrl}/${slug}`);
  }
}
