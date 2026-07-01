import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminContentService, ContentResponse, UpdateContentRequest } from './admin-content.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-manage-content',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="admin-page">
      <div class="admin-page__header">
        <h1>Site Content</h1>
      </div>

      @if (editingItem()) {
        <div class="admin-form-panel">
          <h3>Edit: {{ editingItem()!.sectionKey }}</h3>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-group"><label>Title *</label><input formControlName="title"></div>
            <div class="form-group"><label>Body</label><textarea formControlName="body" rows="6"></textarea></div>
            <div class="form-row">
              <div class="form-group"><label>Image URL</label><input formControlName="imageUrl"></div>
              <div class="form-group"><label>Meta Data (JSON)</label><input formControlName="metaData"></div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn--primary" [disabled]="form.invalid || isSaving()">Save</button>
              <button type="button" class="btn btn--secondary" (click)="editingItem.set(null)">Cancel</button>
            </div>
          </form>
        </div>
      }

      @if (isLoading()) {
        <p class="admin-loading">Loading...</p>
      } @else {
        <table class="admin-table">
          <thead><tr><th>Section</th><th>Title</th><th>Updated</th><th>Actions</th></tr></thead>
          <tbody>
            @for (item of items(); track item.id) {
              <tr>
                <td><code>{{ item.sectionKey }}</code></td>
                <td>{{ item.title }}</td>
                <td>{{ item.updatedAt | date:'short' }}</td>
                <td class="actions-cell">
                  <button class="btn-icon" (click)="editItem(item)">✏️</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: [`@use 'admin-crud'; code { font-size: 0.8125rem; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }`]
})
export class ManageContentComponent implements OnInit {
  private readonly service = inject(AdminContentService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly items = signal<ContentResponse[]>([]);
  readonly editingItem = signal<ContentResponse | null>(null);

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    body: [''],
    imageUrl: [''],
    metaData: ['']
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading.set(true);
    this.service.getAll().subscribe({
      next: r => { this.isLoading.set(false); if (r.success && r.data) this.items.set(r.data); },
      error: () => this.isLoading.set(false)
    });
  }

  editItem(item: ContentResponse): void {
    this.editingItem.set(item);
    this.form.patchValue({ title: item.title, body: item.body || '', imageUrl: item.imageUrl || '', metaData: item.metaData || '' });
  }

  onSubmit(): void {
    const item = this.editingItem();
    if (!item || this.form.invalid) return;
    this.isSaving.set(true);
    const v = this.form.value;
    const req: UpdateContentRequest = { title: v.title, body: v.body || null, imageUrl: v.imageUrl || null, metaData: v.metaData || null };
    this.service.update(item.id, req).subscribe({
      next: r => { this.isSaving.set(false); if (r.success) { this.notification.success('Content updated!'); this.editingItem.set(null); this.load(); } else this.notification.error(r.message); },
      error: () => { this.isSaving.set(false); this.notification.error('Update failed.'); }
    });
  }
}
