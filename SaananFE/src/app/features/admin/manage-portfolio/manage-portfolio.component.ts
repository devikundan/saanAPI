import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminPortfolioService, CreatePortfolioRequest } from './admin-portfolio.service';
import { PortfolioResponse } from '@core/models/portfolio.model';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-manage-portfolio',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './manage-portfolio.component.html',
  styleUrl: './manage-portfolio.component.scss'
})
export class ManagePortfolioComponent implements OnInit {
  private readonly service = inject(AdminPortfolioService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly data = signal<PaginatedResult<PortfolioResponse> | null>(null);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      slug: [''],
      description: ['', Validators.required],
      clientName: [''],
      projectUrl: [''],
      thumbnailUrl: [''],
      technologies: [''],
      completedAt: [''],
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

  editItem(item: PortfolioResponse): void {
    this.editingId.set(item.id);
    this.form.patchValue({ ...item, completedAt: item.completedAt ? item.completedAt.substring(0, 10) : '' });
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const v = this.form.value;
    const req: CreatePortfolioRequest = { title: v.title, slug: v.slug || null, description: v.description, clientName: v.clientName || null, projectUrl: v.projectUrl || null, thumbnailUrl: v.thumbnailUrl || null, technologies: v.technologies || null, completedAt: v.completedAt || null, isActive: v.isActive, displayOrder: v.displayOrder };
    const obs = this.editingId() ? this.service.update(this.editingId()!, req) : this.service.create(req);
    obs.subscribe({
      next: r => { this.isSaving.set(false); if (r.success) { this.notification.success('Saved!'); this.closeForm(); this.loadPage(this.currentPage()); } else this.notification.error(r.message); },
      error: () => { this.isSaving.set(false); this.notification.error('Save failed.'); }
    });
  }

  deleteItem(id: string): void {
    if (!confirm('Delete this project?')) return;
    this.service.delete(id).subscribe({
      next: r => { if (r.success) { this.notification.success('Deleted.'); this.loadPage(this.currentPage()); } },
      error: () => this.notification.error('Delete failed.')
    });
  }
}
