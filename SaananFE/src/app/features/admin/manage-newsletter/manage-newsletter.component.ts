import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminNewsletterService, NewsletterSubscriberResponse } from './admin-newsletter.service';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-manage-newsletter',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './manage-newsletter.component.html',
  styleUrl: './manage-newsletter.component.scss'
})
export class ManageNewsletterComponent implements OnInit {
  private readonly service = inject(AdminNewsletterService);
  private readonly notification = inject(NotificationService);

  readonly isLoading = signal(true);
  readonly currentPage = signal(1);
  readonly data = signal<PaginatedResult<NewsletterSubscriberResponse> | null>(null);

  ngOnInit(): void { this.loadPage(1); }

  loadPage(page: number): void {
    this.currentPage.set(page);
    this.isLoading.set(true);
    this.service.getAll(page).subscribe({
      next: r => { this.isLoading.set(false); if (r.success && r.data) this.data.set(r.data); },
      error: () => this.isLoading.set(false)
    });
  }

  deleteItem(id: string): void {
    if (!confirm('Remove this subscriber?')) return;
    this.service.delete(id).subscribe({
      next: r => { if (r.success) { this.notification.success('Removed.'); this.loadPage(this.currentPage()); } },
      error: () => this.notification.error('Delete failed.')
    });
  }
}
