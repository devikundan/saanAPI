import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../contact.service';
import { NotificationService } from '@core/services/notification.service';
import { CreateContactMessageRequest } from '@core/models/contact.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
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
