import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminContentService, ContentResponse, UpdateContentRequest } from './admin-content.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-manage-content',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './manage-content.component.html',
  styleUrl: './manage-content.component.scss'
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
