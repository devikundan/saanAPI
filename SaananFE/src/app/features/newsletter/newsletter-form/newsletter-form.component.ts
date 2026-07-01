import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsletterService } from '../newsletter.service';
import { NotificationService } from '@core/services/notification.service';
import { NewsletterSubscribeRequest } from '@core/models/newsletter.model';

@Component({
  selector: 'app-newsletter-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="newsletter-form">
      @if (isSubscribed()) {
        <p class="newsletter-form__success">✓ You're subscribed! Thank you.</p>
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="newsletter-form__inner">
          <input
            formControlName="email"
            type="email"
            placeholder="Enter your email"
            class="newsletter-form__input">
          <button
            type="submit"
            class="btn btn--primary newsletter-form__btn"
            [disabled]="form.invalid || isSubmitting()">
            {{ isSubmitting() ? '...' : 'Subscribe' }}
          </button>
        </form>
        @if (errorMessage()) {
          <p class="newsletter-form__error">{{ errorMessage() }}</p>
        }
      }
    </div>
  `,
  styles: [`
    .newsletter-form__inner {
      display: flex;
      gap: 0.5rem;
    }

    .newsletter-form__input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }
    }

    .newsletter-form__btn {
      white-space: nowrap;
      padding: 0.75rem 1.25rem;
    }

    .newsletter-form__success {
      color: var(--color-success);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .newsletter-form__error {
      color: var(--color-error);
      font-size: 0.75rem;
      margin-top: 0.375rem;
    }
  `]
})
export class NewsletterFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly newsletterService = inject(NewsletterService);
  private readonly notificationService = inject(NotificationService);

  readonly isSubmitting = signal(false);
  readonly isSubscribed = signal(false);
  readonly errorMessage = signal<string>('');

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const request: NewsletterSubscribeRequest = {
      email: this.form.value.email,
      name: null
    };

    this.newsletterService.subscribe(request).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.isSubscribed.set(true);
        } else {
          this.errorMessage.set(response.message || 'Subscription failed.');
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('An error occurred. Please try again.');
      }
    });
  }
}
