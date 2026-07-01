import { Component, inject, OnInit, signal } from '@angular/core';
import { TestimonialsService } from '../testimonials.service';
import { TestimonialResponse } from '@core/models/testimonial.model';

@Component({
  selector: 'app-testimonials-list',
  standalone: true,
  templateUrl: './testimonials-list.component.html',
  styleUrl: './testimonials-list.component.scss'
})
export class TestimonialsListComponent implements OnInit {
  private readonly testimonialsService = inject(TestimonialsService);
  readonly testimonials = signal<TestimonialResponse[]>([]);

  ngOnInit(): void {
    this.testimonialsService.getActiveTestimonials().subscribe((response) => {
      if (response.success && response.data) {
        this.testimonials.set(response.data);
      }
    });
  }

  getStars(count: number): number[] {
    return Array(Math.max(0, count)).fill(0);
  }
}
