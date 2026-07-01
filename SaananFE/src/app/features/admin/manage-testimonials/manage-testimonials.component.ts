import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminTestimonialsService, CreateTestimonialRequest } from './admin-testimonials.service';
import { TestimonialResponse } from '@core/models/testimonial.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-manage-testimonials',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './manage-testimonials.component.html',
  styleUrl: './manage-testimonials.component.scss'
})
export class ManageTestimonialsComponent implements OnInit {
  private readonly service = inject(AdminTestimonialsService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly data = signal<PaginatedResult<TestimonialResponse> | null>(null);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      clientName: ['', Validators.required],
      clientTitle: [''],
      clientImageUrl: [''],
      content: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      isActive: [true],
      displayOrder: [0]
    });
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.currentPage.set(page);
    this.isLoading.set(true);
    this.service.getAll(page).subscribe({
      next: r => { this.isLoading.set(false); if (r.success && r.data) this.data.set(r.data); },
      error: () => this.isLoading.set(false)
    });
  }

  openForm(): void { this.editingId.set(null); this.form.reset({ isActive: true, displayOrder: 0, rating: 5 }); this.showForm.set(true); }
  closeForm(): void { this.showForm.set(false); }

  editItem(item: TestimonialResponse): void {
    this.editingId.set(item.id);
    this.form.patchValue(item);
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const v = this.form.value;
    const req: CreateTestimonialRequest = { clientName: v.clientName, clientTitle: v.clientTitle || null, clientImageUrl: v.clientImageUrl || null, content: v.content, rating: v.rating, isActive: v.isActive, displayOrder: v.displayOrder };
    const obs = this.editingId() ? this.service.update(this.editingId()!, req) : this.service.create(req);
    obs.subscribe({
      next: r => { this.isSaving.set(false); if (r.success) { this.notification.success('Saved!'); this.closeForm(); this.loadPage(this.currentPage()); } else this.notification.error(r.message); },
      error: () => { this.isSaving.set(false); this.notification.error('Save failed.'); }
    });
  }

  deleteItem(id: string): void {
    if (!confirm('Delete this testimonial?')) return;
    this.service.delete(id).subscribe({
      next: r => { if (r.success) { this.notification.success('Deleted.'); this.loadPage(this.currentPage()); } },
      error: () => this.notification.error('Delete failed.')
    });
  }
}
