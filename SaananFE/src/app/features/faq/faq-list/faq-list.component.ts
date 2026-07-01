import { Component, inject, OnInit, signal } from '@angular/core';
import { FaqService } from '../faq.service';
import { FaqResponse } from '@core/models/faq.model';

@Component({
  selector: 'app-faq-list',
  standalone: true,
  template: `
    <section class="faq-page">
      <div class="container">
        <div class="faq-page__header">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our services</p>
        </div>

        <div class="faq-list">
          @for (faq of faqs(); track faq.id) {
            <div class="faq-item" [class.faq-item--open]="openId() === faq.id">
              <button class="faq-item__question" (click)="toggle(faq.id)">
                <span>{{ faq.question }}</span>
                <span class="faq-item__icon">{{ openId() === faq.id ? '−' : '+' }}</span>
              </button>
              @if (openId() === faq.id) {
                <div class="faq-item__answer">
                  <p>{{ faq.answer }}</p>
                </div>
              }
            </div>
          } @empty {
            <p class="faq-page__empty">No FAQs available yet.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .faq-page {
      padding: 3rem 0;
    }

    .faq-page__header {
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

    .faq-list {
      max-width: 750px;
      margin: 0 auto;
    }

    .faq-item {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      margin-bottom: 0.75rem;
      overflow: hidden;
      transition: border-color 0.2s;

      &--open {
        border-color: var(--color-primary);
      }
    }

    .faq-item__question {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      background: none;
      font-size: 1rem;
      font-weight: 500;
      text-align: left;
      color: var(--color-text);
      gap: 1rem;
    }

    .faq-item__icon {
      font-size: 1.25rem;
      font-weight: 300;
      color: var(--color-primary);
      flex-shrink: 0;
    }

    .faq-item__answer {
      padding: 0 1.5rem 1.25rem;

      p {
        font-size: 0.9375rem;
        color: var(--color-text-secondary);
        line-height: 1.7;
      }
    }

    .faq-page__empty {
      text-align: center;
      color: var(--color-text-secondary);
      padding: 2rem;
    }
  `]
})
export class FaqListComponent implements OnInit {
  private readonly faqService = inject(FaqService);
  readonly faqs = signal<FaqResponse[]>([]);
  readonly openId = signal<string | null>(null);

  ngOnInit(): void {
    this.faqService.getActiveFaqs().subscribe((response) => {
      if (response.success && response.data) {
        this.faqs.set(response.data);
      }
    });
  }

  toggle(id: string): void {
    this.openId.set(this.openId() === id ? null : id);
  }
}
