import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../services.service';
import { ServiceResponse } from '@core/models/service.model';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="services-page">
      <div class="container">
        <div class="services-page__header">
          <h1>Our Services</h1>
          <p>Comprehensive IT solutions tailored to your business needs</p>
        </div>

        <div class="services-grid">
          @for (service of services(); track service.id) {
            <a [routerLink]="['/services', service.slug]" class="service-card">
              @if (service.iconUrl) {
                <img [src]="service.iconUrl" [alt]="service.title" class="service-card__icon">
              }
              <h3 class="service-card__title">{{ service.title }}</h3>
              <p class="service-card__desc">{{ service.shortDescription }}</p>
              <span class="service-card__category">{{ service.serviceCategoryName }}</span>
            </a>
          } @empty {
            <p class="services-page__empty">No services available at the moment.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .services-page {
      padding: 3rem 0;
    }

    .services-page__header {
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

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .service-card {
      padding: 2rem;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      transition: all 0.2s;
      color: inherit;

      &:hover {
        box-shadow: var(--shadow-md);
        border-color: var(--color-primary);
        transform: translateY(-2px);
      }
    }

    .service-card__icon {
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
    }

    .service-card__title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .service-card__desc {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .service-card__category {
      font-size: 0.75rem;
      background: var(--color-bg-secondary);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      color: var(--color-primary);
      font-weight: 500;
    }

    .services-page__empty {
      grid-column: 1 / -1;
      text-align: center;
      color: var(--color-text-secondary);
      padding: 2rem;
    }
  `]
})
export class ServicesListComponent implements OnInit {
  private readonly servicesService = inject(ServicesService);
  readonly services = signal<ServiceResponse[]>([]);

  ngOnInit(): void {
    this.servicesService.getActiveServices().subscribe((response) => {
      if (response.success && response.data) {
        this.services.set(response.data);
      }
    });
  }
}
