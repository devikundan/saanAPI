import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../contact.service';
import { NotificationService } from '@core/services/notification.service';
import { CreateContactMessageRequest } from '@core/models/contact.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="contact-page">
      <div class="container">
        <div class="contact-page__wrapper">
          <div class="contact-page__header">
            <h1>Contact Us</h1>
            <p>Have a question or need help? Send us a message.</p>
          </div>

          @if (isSuccess()) {
            <div class="contact-success">
              <div class="contact-success__icon">✓</div>
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We'll respond within 24 hours.</p>
              <button class="btn btn--secondary" (click)="resetForm()">Send Another Message</button>
            </div>
          } @else {
            <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
              <div class="form-group">
                <label for="fullName">Full Name *</label>
                <input id="fullName" formControlName="fullName" type="text" placeholder="Your full name">
                @if (form.get('fullName')?.invalid && form.get('fullName')?.touched) {
                  <span class="error-message">Full name is required</span>
                }
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="email">Email *</label>
                  <input id="email" formControlName="email" type="email" placeholder="your@email.com">
                  @if (form.get('email')?.invalid && form.get('email')?.touched) {
                    <span class="error-message">Valid email is required</span>
                  }
                </div>

                <div class="form-group">
                  <label for="phone">Phone</label>
                  <input id="phone" formControlName="phone" type="tel" placeholder="+1 234 567 890">
                </div>
              </div>

              <div class="form-group">
                <label for="subject">Subject *</label>
                <input id="subject" formControlName="subject" type="text" placeholder="What is this about?">
                @if (form.get('subject')?.invalid && form.get('subject')?.touched) {
                  <span class="error-message">Subject is required</span>
                }
              </div>

              <div class="form-group">
                <label for="message">Message *</label>
                <textarea id="message" formControlName="message" placeholder="Your message..." rows="5"></textarea>
                @if (form.get('message')?.invalid && form.get('message')?.touched) {
                  <span class="error-message">Message is required (min 10 characters)</span>
                }
              </div>

              @if (serverErrors().length > 0) {
                <div class="form-errors">
                  @for (error of serverErrors(); track error) {
                    <p>{{ error }}</p>
                  }
                </div>
              }

              <button type="submit" class="btn btn--primary contact-form__submit" [disabled]="form.invalid || isSubmitting()">
                {{ isSubmitting() ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-page {
      padding: 3rem 0;
    }

    .contact-page__wrapper {
      max-width: 600px;
      margin: 0 auto;
    }

    .contact-page__header {
      text-align: center;
      margin-bottom: 2.5rem;

      h1 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      p {
        color: var(--color-text-secondary);
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .contact-form__submit {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
    }

    .form-errors {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--color-error);
      border-radius: var(--radius-md);
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;

      p {
        font-size: 0.8125rem;
        color: var(--color-error);
      }
    }

    .contact-success {
      text-align: center;
      padding: 3rem 1rem;

      h2 {
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
      }

      p {
        color: var(--color-text-secondary);
        margin-bottom: 1.5rem;
      }
    }

    .contact-success__icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--color-success);
      color: #fff;
      font-size: 1.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
    }

    @media (max-width: 480px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly notificationService = inject(NotificationService);

  readonly isSubmitting = signal(false);
  readonly isSuccess = signal(false);
  readonly serverErrors = signal<string[]>([]);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.serverErrors.set([]);

    const request: CreateContactMessageRequest = {
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      phone: this.form.value.phone || null,
      subject: this.form.value.subject,
      message: this.form.value.message
    };

    this.contactService.submitMessage(request).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.isSuccess.set(true);
        } else {
          this.serverErrors.set(response.errors || [response.message]);
        }
      },
      error: (error) => {
        this.isSubmitting.set(false);
        if (error.error?.errors) {
          this.serverErrors.set(error.error.errors);
        } else {
          this.notificationService.error('Failed to send message. Please try again.');
        }
      }
    });
  }

  resetForm(): void {
    this.isSuccess.set(false);
    this.form.reset();
  }
}
