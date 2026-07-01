import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsletterService } from '../newsletter.service';
import { NotificationService } from '@core/services/notification.service';
import { NewsletterSubscribeRequest } from '@core/models/newsletter.model';

@Component({
  selector: 'app-newsletter-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './newsletter-form.component.html',
  styleUrl: './newsletter-form.component.scss'
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
