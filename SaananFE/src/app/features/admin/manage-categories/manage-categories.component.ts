import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminCategoriesService, ServiceCategoryResponse, CreateServiceCategoryRequest } from './admin-categories.service';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './manage-categories.component.html',
  styleUrl: './manage-categories.component.scss'
})
export class ManageCategoriesComponent implements OnInit {
  private readonly service = inject(AdminCategoriesService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly data = signal<PaginatedResult<ServiceCategoryResponse> | null>(null);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      description: [''],
      iconUrl: [''],
      displayOrder: [0],
      isActive: [true]
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

  openForm(): void { this.editingId.set(null); this.form.reset({ isActive: true, displayOrder: 0 }); this.showForm.set(true); }
  closeForm(): void { this.showForm.set(false); }

  editItem(item: ServiceCategoryResponse): void {
    this.editingId.set(item.id);
    this.form.patchValue(item);
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const req: CreateServiceCategoryRequest = { ...this.form.value, slug: this.form.value.slug || null, description: this.form.value.description || null, iconUrl: this.form.value.iconUrl || null };
    const obs = this.editingId() ? this.service.update(this.editingId()!, req) : this.service.create(req);
    obs.subscribe({
      next: r => { this.isSaving.set(false); if (r.success) { this.notification.success('Saved!'); this.closeForm(); this.loadPage(this.currentPage()); } else this.notification.error(r.message); },
      error: () => { this.isSaving.set(false); this.notification.error('Save failed.'); }
    });
  }

  deleteItem(id: string): void {
    if (!confirm('Delete this category?')) return;
    this.service.delete(id).subscribe({
      next: r => { if (r.success) { this.notification.success('Deleted.'); this.loadPage(this.currentPage()); } },
      error: () => this.notification.error('Delete failed.')
    });
  }
}
