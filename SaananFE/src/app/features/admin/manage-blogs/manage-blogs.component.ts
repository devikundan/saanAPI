import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminBlogsService, CreateBlogRequest } from './admin-blogs.service';
import { BlogResponse, BlogStatus } from '@core/models/blog.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-manage-blogs',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="admin-page">
      <div class="admin-page__header">
        <h1>Manage Blogs</h1>
        <button class="btn btn--primary" (click)="openForm()">+ Add Blog</button>
      </div>

      @if (showForm()) {
        <div class="admin-form-panel">
          <h3>{{ editingId() ? 'Edit Blog' : 'New Blog' }}</h3>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="form-group"><label>Title *</label><input formControlName="title"></div>
              <div class="form-group"><label>Slug</label><input formControlName="slug" placeholder="auto-generated"></div>
            </div>
            <div class="form-group"><label>Summary</label><textarea formControlName="summary" rows="2"></textarea></div>
            <div class="form-group"><label>Content *</label><textarea formControlName="content" rows="8"></textarea></div>
            <div class="form-row">
              <div class="form-group"><label>Featured Image URL</label><input formControlName="featuredImageUrl"></div>
              <div class="form-group"><label>Author *</label><input formControlName="author"></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Tags</label><input formControlName="tags" placeholder="tag1, tag2"></div>
              <div class="form-group">
                <label>Status *</label>
                <select formControlName="status">
                  <option [value]="0">Draft</option>
                  <option [value]="1">Published</option>
                  <option [value]="2">Archived</option>
                </select>
              </div>
            </div>
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
          <thead><tr><th>Title</th><th>Author</th><th>Status</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>
            @for (item of data()!.items; track item.id) {
              <tr>
                <td>{{ item.title }}</td>
                <td>{{ item.author }}</td>
                <td><span class="badge" [class.badge--active]="item.status === 1">{{ getStatusLabel(item.status) }}</span></td>
                <td>{{ item.publishedAt ? (item.publishedAt | date:'mediumDate') : '—' }}</td>
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
export class ManageBlogsComponent implements OnInit {
  private readonly service = inject(AdminBlogsService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly data = signal<PaginatedResult<BlogResponse> | null>(null);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      slug: [''],
      summary: [''],
      content: ['', Validators.required],
      featuredImageUrl: [''],
      author: ['', Validators.required],
      tags: [''],
      status: [0]
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

  openForm(): void { this.editingId.set(null); this.form.reset({ status: 0 }); this.showForm.set(true); }
  closeForm(): void { this.showForm.set(false); }

  editItem(item: BlogResponse): void {
    this.editingId.set(item.id);
    this.form.patchValue(item);
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const req: CreateBlogRequest = { ...this.form.value, slug: this.form.value.slug || null, summary: this.form.value.summary || null, featuredImageUrl: this.form.value.featuredImageUrl || null, tags: this.form.value.tags || null, status: Number(this.form.value.status) };
    const obs = this.editingId() ? this.service.update(this.editingId()!, req) : this.service.create(req);
    obs.subscribe({
      next: r => { this.isSaving.set(false); if (r.success) { this.notification.success('Blog saved!'); this.closeForm(); this.loadPage(this.currentPage()); } else this.notification.error(r.message); },
      error: () => { this.isSaving.set(false); this.notification.error('Save failed.'); }
    });
  }

  deleteItem(id: string): void {
    if (!confirm('Delete this blog?')) return;
    this.service.delete(id).subscribe({
      next: r => { if (r.success) { this.notification.success('Deleted.'); this.loadPage(this.currentPage()); } },
      error: () => this.notification.error('Delete failed.')
    });
  }

  getStatusLabel(status: BlogStatus): string {
    return ['Draft', 'Published', 'Archived'][status] ?? 'Unknown';
  }
}
