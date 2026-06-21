import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../blog.service';
import { BlogResponse } from '@core/models/blog.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <section class="blog-detail">
      <div class="container">
        @if (blog(); as post) {
          <nav class="breadcrumb">
            <a routerLink="/blog">Blog</a>
            <span>/</span>
            <span>{{ post.title }}</span>
          </nav>

          <article class="blog-detail__article">
            @if (post.featuredImageUrl) {
              <img [src]="post.featuredImageUrl" [alt]="post.title" class="blog-detail__image">
            }

            <h1>{{ post.title }}</h1>

            <div class="blog-detail__meta">
              <span>By {{ post.author }}</span>
              @if (post.publishedAt) {
                <span>{{ post.publishedAt | date:'longDate' }}</span>
              }
            </div>

            @if (post.tags) {
              <div class="blog-detail__tags">
                @for (tag of post.tags.split(','); track tag) {
                  <span class="tag">{{ tag.trim() }}</span>
                }
              </div>
            }

            <div class="blog-detail__content" [innerHTML]="post.content"></div>
          </article>
        } @else if (notFound()) {
          <div class="blog-detail__not-found">
            <h2>Blog post not found</h2>
            <a routerLink="/blog">Back to Blog</a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .blog-detail {
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

    .blog-detail__article {
      max-width: 800px;
      margin: 0 auto;

      h1 {
        font-size: 2.25rem;
        font-weight: 700;
        line-height: 1.3;
        margin-bottom: 1rem;
      }
    }

    .blog-detail__image {
      width: 100%;
      border-radius: var(--radius-lg);
      margin-bottom: 2rem;
    }

    .blog-detail__meta {
      display: flex;
      gap: 1.5rem;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin-bottom: 1.5rem;
    }

    .blog-detail__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .tag {
      font-size: 0.75rem;
      background: var(--color-bg-secondary);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      color: var(--color-primary);
    }

    .blog-detail__content {
      line-height: 1.8;
      font-size: 1rem;
    }

    .blog-detail__not-found {
      text-align: center;
      padding: 4rem 0;

      h2 {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);

  readonly blog = signal<BlogResponse | null>(null);
  readonly notFound = signal(false);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.blogService.getBySlug(slug).subscribe((response) => {
        if (response.success && response.data) {
          this.blog.set(response.data);
        } else {
          this.notFound.set(true);
        }
      });
    }
  }
}
