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
  templateUrl: './ai-query-page.component.html',
  styleUrl: './ai-query-page.component.scss'
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
