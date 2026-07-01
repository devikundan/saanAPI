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
  template: `
    <div class="admin-page">
      <div class="admin-page__header">
        <h1>Manage Categories</h1>
        <button class="btn btn--primary" (click)="openForm()">+ Add Category</button>
      </div>

      @if (showForm()) {
        <div class="admin-form-panel">
          <h3>{{ editingId() ? 'Edit Category' : 'New Category' }}</h3>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="form-group"><label>Name *</label><input formControlName="name"></div>
              <div class="form-group"><label>Slug</label><input formControlName="slug" placeholder="auto-generated"></div>
            </div>
            <div class="form-group"><label>Description</label><textarea formControlName="description" rows="2"></textarea></div>
            <div class="form-row">
              <div class="form-group"><label>Icon URL</label><input formControlName="iconUrl"></div>
              <div class="form-group"><label>Display Order</label><input formControlName="displayOrder" type="number"></div>
            </div>
            <div class="form-group form-group--checkbox"><label><input formControlName="isActive" type="checkbox"> Active</label></div>
            <div class="form-actions">
              <button type="submit" class="btn btn--primary" [disabled]="form.invalid || isSaving()">Save</button>
              <button type="button" class="btn btn--secondary" (click)="closeForm()">Cancel</button>
            </div>
          </form>
        </div>
      }

      @if (isLoading()) {
        <p class="admin-loading">Loading...</p>
      } @else if (data()) {
        <table class="admin-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Order</th><th>Active</th><th>Updated</th><th>Actions</th></tr></thead>
          <tbody>
            @for (item of data()!.items; track item.id) {
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.slug }}</td>
                <td>{{ item.displayOrder }}</td>
                <td><span class="badge" [class.badge--active]="item.isActive">{{ item.isActive ? 'Yes' : 'No' }}</span></td>
                <td>{{ item.updatedAt | date:'short' }}</td>
                <td class="actions-cell">
                  <button class="btn-icon" (click)="editItem(item)">✏️</button>
                  <button class="btn-icon btn-icon--danger" (click)="deleteItem(item.id)">🗑️</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if (data()!.totalPages > 1) {
          <div class="admin-pagination">
            <button [disabled]="!data()!.hasPreviousPage" (click)="loadPage(currentPage() - 1)">← Prev</button>
            <span>Page {{ currentPage() }} of {{ data()!.totalPages }}</span>
            <button [disabled]="!data()!.hasNextPage" (click)="loadPage(currentPage() + 1)">Next →</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`@use 'admin-crud';`]
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
