import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServicesService } from '../services.service';
import { ServiceResponse } from '@core/models/service.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="service-detail">
      <div class="container">
        @if (service(); as svc) {
          <nav class="breadcrumb">
            <a routerLink="/services">Services</a>
            <span>/</span>
            <span>{{ svc.title }}</span>
          </nav>

          <div class="service-detail__content">
            <h1>{{ svc.title }}</h1>
            <span class="service-detail__category">{{ svc.serviceCategoryName }}</span>
            <p class="service-detail__summary">{{ svc.shortDescription }}</p>
            <div class="service-detail__body" [innerHTML]="svc.detailedDescription"></div>

            <div class="service-detail__cta">
              <a routerLink="/get-started" class="btn btn--primary">Get Started</a>
              <a routerLink="/contact" class="btn btn--secondary">Contact Us</a>
            </div>
          </div>
        } @else if (notFound()) {
          <div class="service-detail__not-found">
            <h2>Service not found</h2>
            <a routerLink="/services">Back to Services</a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .service-detail {
      padding: 2rem 0;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin-bottom: 2rem;

      a:hover {
        color: var(--color-primary);
      }
    }

    .service-detail__content {
      max-width: 800px;

      h1 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
      }
    }

    .service-detail__category {
      display: inline-block;
      font-size: 0.8125rem;
      background: var(--color-bg-secondary);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      color: var(--color-primary);
      font-weight: 500;
      margin-bottom: 1.5rem;
    }

    .service-detail__summary {
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .service-detail__body {
      line-height: 1.8;
      font-size: 1rem;
      margin-bottom: 2.5rem;
    }

    .service-detail__cta {
      display: flex;
      gap: 1rem;
    }

    .service-detail__not-found {
      text-align: center;
      padding: 4rem 0;

      h2 {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class ServiceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly servicesService = inject(ServicesService);

  readonly service = signal<ServiceResponse | null>(null);
  readonly notFound = signal(false);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.servicesService.getBySlug(slug).subscribe((response) => {
        if (response.success && response.data) {
          this.service.set(response.data);
        } else {
          this.notFound.set(true);
        }
      });
    }
  }
}
