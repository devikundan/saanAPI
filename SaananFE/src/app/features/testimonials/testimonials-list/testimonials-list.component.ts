import { Component, inject, OnInit, signal } from '@angular/core';
import { TestimonialsService } from '../testimonials.service';
import { TestimonialResponse } from '@core/models/testimonial.model';

@Component({
  selector: 'app-testimonials-list',
  standalone: true,
  template: `
    <section class="testimonials-page">
      <div class="container">
        <div class="testimonials-page__header">
          <h1>What Our Clients Say</h1>
          <p>Trusted by businesses worldwide</p>
        </div>

        <div class="testimonials-grid">
          @for (testimonial of testimonials(); track testimonial.id) {
            <div class="testimonial-card">
              <div class="testimonial-card__rating">
                @for (star of getStars(testimonial.rating); track $index) {
                  <span class="star star--filled">★</span>
                }
                @for (star of getStars(5 - testimonial.rating); track $index) {
                  <span class="star">★</span>
                }
              </div>
              <p class="testimonial-card__content">{{ testimonial.content }}</p>
              <div class="testimonial-card__author">
                @if (testimonial.clientImageUrl) {
                  <img [src]="testimonial.clientImageUrl" [alt]="testimonial.clientName" class="testimonial-card__avatar">
                } @else {
                  <div class="testimonial-card__avatar testimonial-card__avatar--placeholder">
                    {{ testimonial.clientName.charAt(0) }}
                  </div>
                }
                <div>
                  <strong>{{ testimonial.clientName }}</strong>
                  @if (testimonial.clientTitle) {
                    <span>{{ testimonial.clientTitle }}</span>
                  }
                </div>
              </div>
            </div>
          } @empty {
            <p class="testimonials-page__empty">No testimonials available yet.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials-page {
      padding: 3rem 0;
    }

    .testimonials-page__header {
      text-align: center;
      margin-bottom: 3rem;

      h1 {
        font-size: 2.25rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--color-text-secondary);
        font-size: 1.125rem;
      }
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .testimonial-card {
      padding: 2rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
    }

    .testimonial-card__rating {
      margin-bottom: 1rem;
    }

    .star {
      color: var(--color-border);
      font-size: 1.125rem;
    }

    .star--filled {
      color: var(--color-warning);
    }

    .testimonial-card__content {
      font-size: 0.9375rem;
      line-height: 1.7;
      color: var(--color-text-secondary);
      flex: 1;
      margin-bottom: 1.5rem;
    }

    .testimonial-card__author {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      strong {
        display: block;
        font-size: 0.875rem;
      }

      span {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
      }
    }

    .testimonial-card__avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .testimonial-card__avatar--placeholder {
      background: var(--color-primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1rem;
    }

    .testimonials-page__empty {
      grid-column: 1 / -1;
      text-align: center;
      color: var(--color-text-secondary);
      padding: 2rem;
    }
  `]
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
