import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@core/constants/api-endpoints';
import { ApiResponse } from '@core/models/api-response.model';
import { TestimonialResponse } from '@core/models/testimonial.model';

@Injectable({ providedIn: 'root' })
export class TestimonialsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}${API_ENDPOINTS.testimonials}`;

  getActiveTestimonials(): Observable<ApiResponse<TestimonialResponse[]>> {
    return this.http.get<ApiResponse<TestimonialResponse[]>>(this.baseUrl);
  }
}
