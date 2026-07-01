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
  templateUrl: './manage-blogs.component.html',
  styleUrl: './manage-blogs.component.scss'
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
