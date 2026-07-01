import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PortfolioService } from '../portfolio.service';
import { PortfolioResponse } from '@core/models/portfolio.model';

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [DatePipe],
  template: `
    <section class="portfolio-page">
      <div class="container">
        <div class="portfolio-page__header">
          <h1>Our Portfolio</h1>
          <p>Showcasing our latest projects and success stories</p>
        </div>

        <div class="portfolio-grid">
          @for (project of projects(); track project.id) {
            <div class="portfolio-card">
              @if (project.thumbnailUrl) {
                <img [src]="project.thumbnailUrl" [alt]="project.title" class="portfolio-card__image">
              }
              <div class="portfolio-card__body">
                <h3 class="portfolio-card__title">{{ project.title }}</h3>
                @if (project.clientName) {
                  <span class="portfolio-card__client">{{ project.clientName }}</span>
                }
                <p class="portfolio-card__desc">{{ project.description }}</p>
                @if (project.technologies) {
                  <div class="portfolio-card__tech">
                    @for (tech of project.technologies.split(','); track tech) {
                      <span class="tech-tag">{{ tech.trim() }}</span>
                    }
                  </div>
                }
                <div class="portfolio-card__footer">
                  @if (project.completedAt) {
                    <span class="portfolio-card__date">{{ project.completedAt | date:'MMM yyyy' }}</span>
                  }
                  @if (project.projectUrl) {
                    <a [href]="project.projectUrl" target="_blank" rel="noopener" class="portfolio-card__link">
                      View Project →
                    </a>
                  }
                </div>
              </div>
            </div>
          } @empty {
            <p class="portfolio-page__empty">No portfolio projects available yet.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .portfolio-page {
      padding: 3rem 0;
    }

    .portfolio-page__header {
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

    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .portfolio-card {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: var(--shadow-md);
      }
    }

    .portfolio-card__image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .portfolio-card__body {
      padding: 1.5rem;
    }

    .portfolio-card__title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .portfolio-card__client {
      font-size: 0.8125rem;
      color: var(--color-primary);
      font-weight: 500;
    }

    .portfolio-card__desc {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin: 0.75rem 0;
    }

    .portfolio-card__tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-bottom: 1rem;
    }

    .tech-tag {
      font-size: 0.6875rem;
      background: var(--color-bg-secondary);
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      color: var(--color-text-secondary);
    }

    .portfolio-card__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8125rem;
    }

    .portfolio-card__date {
      color: var(--color-text-secondary);
    }

    .portfolio-card__link {
      font-weight: 500;
    }

    .portfolio-page__empty {
      grid-column: 1 / -1;
      text-align: center;
      color: var(--color-text-secondary);
      padding: 2rem;
    }
  `]
})
export class PortfolioListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  readonly projects = signal<PortfolioResponse[]>([]);

  ngOnInit(): void {
    this.portfolioService.getActiveProjects().subscribe((response) => {
      if (response.success && response.data) {
        this.projects.set(response.data);
      }
    });
  }
}
