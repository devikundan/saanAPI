import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadService } from '../lead.service';
import { ServicesService } from '@features/services/services.service';
import { ServiceResponse } from '@core/models/service.model';
import { NotificationService } from '@core/services/notification.service';
import { CreateLeadRequest } from '@core/models/lead.model';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="lead-page">
      <div class="container">
        <div class="lead-page__wrapper">
          <div class="lead-page__header">
            <h1>Get Started</h1>
            <p>Tell us about your project and we'll get back to you within 24 hours.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="lead-form" novalidate>
            <div class="form-group">
              <label for="fullName">Full Name *</label>
              <input id="fullName" formControlName="fullName" type="text" placeholder="John Doe">
              @if (form.get('fullName')?.invalid && form.get('fullName')?.touched) {
                <span class="error-message">Full name is required (min 2 characters)</span>
              }
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input id="email" formControlName="email" type="email" placeholder="john@company.com">
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <span class="error-message">Valid email address is required</span>
              }
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone">Phone</label>
                <input id="phone" formControlName="phone" type="tel" placeholder="+1 234 567 890">
              </div>

              <div class="form-group">
                <label for="company">Company</label>
                <input id="company" formControlName="company" type="text" placeholder="Company name">
              </div>
            </div>

            <div class="form-group">
              <label for="serviceId">Service of Interest</label>
              <select id="serviceId" formControlName="serviceId">
                <option [value]="null">-- Select a service --</option>
                @for (service of services(); track service.id) {
                  <option [value]="service.id">{{ service.title }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label for="message">Message *</label>
              <textarea id="message" formControlName="message" placeholder="Describe your project requirements..." rows="5"></textarea>
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

            <button type="submit" class="btn btn--primary lead-form__submit" [disabled]="form.invalid || isSubmitting()">
              {{ isSubmitting() ? 'Submitting...' : 'Submit Inquiry' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .lead-page {
      padding: 3rem 0;
    }

    .lead-page__wrapper {
      max-width: 640px;
      margin: 0 auto;
    }

    .lead-page__header {
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

    .lead-form__submit {
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
        margin-bottom: 0.25rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    @media (max-width: 480px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LeadFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly leadService = inject(LeadService);
  private readonly servicesService = inject(ServicesService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly services = signal<ServiceResponse[]>([]);
  readonly isSubmitting = signal(false);
  readonly serverErrors = signal<string[]>([]);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      serviceId: [null],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]]
    });

    this.servicesService.getActiveServices().subscribe((response) => {
      if (response.success && response.data) {
        this.services.set(response.data);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.serverErrors.set([]);

    const request: CreateLeadRequest = {
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      phone: this.form.value.phone || null,
      company: this.form.value.company || null,
      serviceId: this.form.value.serviceId || null,
      message: this.form.value.message
    };

    this.leadService.submitLead(request).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.notificationService.success('Your inquiry has been submitted successfully!');
          this.router.navigate(['/get-started/confirmation']);
        } else {
          this.serverErrors.set(response.errors || [response.message]);
        }
      },
      error: (error) => {
        this.isSubmitting.set(false);
        if (error.error?.errors) {
          this.serverErrors.set(error.error.errors);
        } else {
          this.notificationService.error('An error occurred. Please try again.');
        }
      }
    });
  }
}
