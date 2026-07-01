import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminFaqsService, CreateFaqRequest } from './admin-faqs.service';
import { FaqResponse } from '@core/models/faq.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-manage-faqs',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="admin-page">
      <div class="admin-page__header">
        <h1>Manage FAQs</h1>
        <button class="btn btn--primary" (click)="openForm()">+ Add FAQ</button>
      </div>

      @if (showForm()) {
        <div class="admin-form-panel">
          <h3>{{ editingId() ? 'Edit' : 'New' }} FAQ</h3>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-group"><label>Question *</label><input formControlName="question"></div>
            <div class="form-group"><label>Answer *</label><textarea formControlName="answer" rows="4"></textarea></div>
            <div class="form-row">
              <div class="form-group"><label>Category</label><input formControlName="category"></div>
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
          <thead><tr><th>Question</th><th>Category</th><th>Order</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            @for (item of data()!.items; track item.id) {
              <tr>
                <td>{{ item.question }}</td>
                <td>{{ item.category || '—' }}</td>
                <td>{{ item.displayOrder }}</td>
                <td><span class="badge" [class.badge--active]="item.isActive">{{ item.isActive ? 'Yes' : 'No' }}</span></td>
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
export class ManageFaqsComponent implements OnInit {
  private readonly service = inject(AdminFaqsService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly data = signal<PaginatedResult<FaqResponse> | null>(null);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      category: [''],
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

  editItem(item: FaqResponse): void {
    this.editingId.set(item.id);
    this.form.patchValue(item);
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const v = this.form.value;
    const req: CreateFaqRequest = { question: v.question, answer: v.answer, category: v.category || null, displayOrder: v.displayOrder, isActive: v.isActive };
    const obs = this.editingId() ? this.service.update(this.editingId()!, req) : this.service.create(req);
    obs.subscribe({
      next: r => { this.isSaving.set(false); if (r.success) { this.notification.success('Saved!'); this.closeForm(); this.loadPage(this.currentPage()); } else this.notification.error(r.message); },
      error: () => { this.isSaving.set(false); this.notification.error('Save failed.'); }
    });
  }

  deleteItem(id: string): void {
    if (!confirm('Delete this FAQ?')) return;
    this.service.delete(id).subscribe({
      next: r => { if (r.success) { this.notification.success('Deleted.'); this.loadPage(this.currentPage()); } },
      error: () => this.notification.error('Delete failed.')
    });
  }
}
