import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../blog.service';
import { BlogListResponse } from '@core/models/blog.model';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, DatePipe, PaginationComponent],
  template: `
    <section class="blog-page">
      <div class="container">
        <div class="blog-page__header">
          <h1>Blog</h1>
          <p>Insights, tutorials, and updates from our team</p>
        </div>

        <div class="blog-grid">
          @for (blog of blogs(); track blog.id) {
            <a [routerLink]="['/blog', blog.slug]" class="blog-card">
              @if (blog.featuredImageUrl) {
                <img [src]="blog.featuredImageUrl" [alt]="blog.title" class="blog-card__image">
              }
              <div class="blog-card__body">
                <h3 class="blog-card__title">{{ blog.title }}</h3>
                @if (blog.summary) {
                  <p class="blog-card__summary">{{ blog.summary }}</p>
                }
                <div class="blog-card__meta">
                  <span>{{ blog.author }}</span>
                  @if (blog.publishedAt) {
                    <span>{{ blog.publishedAt | date:'mediumDate' }}</span>
                  }
                </div>
              </div>
            </a>
          } @empty {
            <p class="blog-page__empty">No blog posts published yet.</p>
          }
        </div>

        @if (totalPages() > 1) {
          <app-pagination
            [currentPage]="currentPage()"
            [totalPages]="totalPages()"
            (pageChange)="onPageChange($event)" />
        }
      </div>
    </section>
  `,
  styles: [`
    .blog-page {
      padding: 3rem 0;
    }

    .blog-page__header {
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

    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2rem;
    }

    .blog-card {
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      color: inherit;
      transition: all 0.2s;

      &:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }
    }

    .blog-card__image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .blog-card__body {
      padding: 1.5rem;
    }

    .blog-card__title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .blog-card__summary {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .blog-card__meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    .blog-page__empty {
      grid-column: 1 / -1;
      text-align: center;
      color: var(--color-text-secondary);
      padding: 2rem;
    }
  `]
})
export class BlogListComponent implements OnInit {
  private readonly blogService = inject(BlogService);

  readonly blogs = signal<BlogListResponse[]>([]);
  readonly currentPage = signal(1);
  readonly totalPages = signal(0);
  private readonly pageSize = 9;

  ngOnInit(): void {
    this.loadBlogs();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadBlogs();
  }

  private loadBlogs(): void {
    this.blogService.getPublishedBlogs(this.currentPage(), this.pageSize).subscribe((response) => {
      if (response.success && response.data) {
        this.blogs.set(response.data.items);
        this.totalPages.set(response.data.totalPages);
      }
    });
  }
}
