import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminServicesService, CreateServiceRequest } from './admin-services.service';
import { AdminCategoriesService, ServiceCategoryResponse } from '../manage-categories/admin-categories.service';
import { ServiceResponse } from '@core/models/service.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-manage-services',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './manage-services.component.html',
  styleUrl: './manage-services.component.scss'
})
export class ManageServicesComponent implements OnInit {
  private readonly service = inject(AdminServicesService);
  private readonly categoriesService = inject(AdminCategoriesService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly data = signal<PaginatedResult<ServiceResponse> | null>(null);
  readonly categories = signal<ServiceCategoryResponse[]>([]);

  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadPage(1);
    this.categoriesService.getAll(1, 50).subscribe(r => {
      if (r.success && r.data) this.categories.set(r.data.items);
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      slug: [''],
      shortDescription: ['', Validators.required],
      detailedDescription: ['', Validators.required],
      iconUrl: [''],
      serviceCategoryId: ['', Validators.required],
      displayOrder: [0],
      isActive: [true]
    });
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

  editItem(item: ServiceResponse): void {
    this.editingId.set(item.id);
    this.form.patchValue(item);
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const req: CreateServiceRequest = { ...this.form.value, slug: this.form.value.slug || null, iconUrl: this.form.value.iconUrl || null };
    const obs = this.editingId()
      ? this.service.update(this.editingId()!, req)
      : this.service.create(req);
    obs.subscribe({
      next: r => {
        this.isSaving.set(false);
        if (r.success) { this.notification.success('Service saved!'); this.closeForm(); this.loadPage(this.currentPage()); }
        else { this.notification.error(r.message); }
      },
      error: () => { this.isSaving.set(false); this.notification.error('Save failed.'); }
    });
  }

  deleteItem(id: string): void {
    if (!confirm('Delete this service?')) return;
    this.service.delete(id).subscribe({
      next: r => { if (r.success) { this.notification.success('Deleted.'); this.loadPage(this.currentPage()); } },
      error: () => this.notification.error('Delete failed.')
    });
  }
}
