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
  templateUrl: './lead-form.component.html',
  styleUrl: './lead-form.component.scss'
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
