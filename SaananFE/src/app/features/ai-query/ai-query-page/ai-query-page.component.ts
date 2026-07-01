import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiQueryService } from '../ai-query.service';
import { NotificationService } from '@core/services/notification.service';
import { QueryClassificationResponse } from '@core/models/query-classification.model';

@Component({
  selector: 'app-ai-query-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="ai-page">
      <div class="container">
        <div class="ai-page__wrapper">
          <div class="ai-page__header">
            <h1>AI Assistant</h1>
            <p>Ask about our services and get intelligent recommendations powered by AI.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="ai-form">
            <div class="ai-form__input-row">
              <textarea
                formControlName="query"
                placeholder="e.g., I need a mobile app for my e-commerce business..."
                rows="3"
                class="ai-form__textarea"></textarea>
              <button
                type="submit"
                class="btn btn--primary ai-form__btn"
                [disabled]="form.invalid || isLoading()">
                {{ isLoading() ? 'Thinking...' : 'Ask AI' }}
              </button>
            </div>
          </form>

          @if (result()) {
            <div class="ai-result">
              <div class="ai-result__header">
                <span class="ai-result__category">{{ result()!.classifiedCategory }}</span>
                <span class="ai-result__confidence">
                  {{ (result()!.confidenceScore * 100).toFixed(0) }}% confidence
                </span>
              </div>

              @if (result()!.aiResponse) {
                <div class="ai-result__response">
                  <p>{{ result()!.aiResponse }}</p>
                </div>
              }

              @if (result()!.suggestedServiceSlug) {
                <div class="ai-result__suggestion">
                  <span>Recommended service:</span>
                  <a [routerLink]="['/services', result()!.suggestedServiceSlug]" class="btn btn--secondary">
                    View Service →
                  </a>
                </div>
              }
            </div>
          }

          @if (errorMessage()) {
            <div class="ai-error">
              <p>{{ errorMessage() }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .ai-page {
      padding: 3rem 0;
    }

    .ai-page__wrapper {
      max-width: 700px;
      margin: 0 auto;
    }

    .ai-page__header {
      text-align: center;
      margin-bottom: 2.5rem;

      h1 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--color-text-secondary);
        font-size: 1.0625rem;
      }
    }

    .ai-form__input-row {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .ai-form__textarea {
      width: 100%;
      padding: 1rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
      min-height: 100px;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.1);
      }
    }

    .ai-form__btn {
      align-self: flex-end;
      padding: 0.75rem 2rem;
    }

    .ai-result {
      margin-top: 2rem;
      padding: 1.5rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-bg-secondary);
    }

    .ai-result__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .ai-result__category {
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--color-primary);
      background: rgba(26, 86, 219, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
    }

    .ai-result__confidence {
      font-size: 0.8125rem;
      color: var(--color-text-secondary);
    }

    .ai-result__response {
      margin-bottom: 1.25rem;

      p {
        font-size: 0.9375rem;
        line-height: 1.7;
        color: var(--color-text);
      }
    }

    .ai-result__suggestion {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);

      span {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
    }

    .ai-error {
      margin-top: 1.5rem;
      padding: 1rem;
      background: rgba(239, 68, 68, 0.1);
      border-radius: var(--radius-md);

      p {
        color: var(--color-error);
        font-size: 0.875rem;
      }
    }
  `]
})
export class AiQueryPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly aiQueryService = inject(AiQueryService);
  private readonly notificationService = inject(NotificationService);

  readonly isLoading = signal(false);
  readonly result = signal<QueryClassificationResponse | null>(null);
  readonly errorMessage = signal<string>('');

  form: FormGroup = this.fb.group({
    query: ['', [Validators.required, Validators.minLength(5)]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.result.set(null);
    this.errorMessage.set('');

    this.aiQueryService.classifyQuery({
      query: this.form.value.query,
      leadId: null,
      contactMessageId: null
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.data) {
          this.result.set(response.data);
        } else {
          this.errorMessage.set(response.message || 'Unable to process your query.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('An error occurred. Please try again.');
      }
    });
  }
}
