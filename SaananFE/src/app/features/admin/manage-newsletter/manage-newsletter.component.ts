import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminNewsletterService, NewsletterSubscriberResponse } from './admin-newsletter.service';
import { PaginatedResult } from '@core/models/paginated-result.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-manage-newsletter',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="admin-page">
      <div class="admin-page__header">
        <h1>Newsletter Subscribers</h1>
      </div>

      @if (isLoading()) {
        <p class="admin-loading">Loading...</p>
      } @else if (data()) {
        <table class="admin-table">
          <thead><tr><th>Email</th><th>Name</th><th>Active</th><th>Subscribed</th><th>Actions</th></tr></thead>
          <tbody>
            @for (item of data()!.items; track item.id) {
              <tr>
                <td>{{ item.email }}</td>
                <td>{{ item.name || '—' }}</td>
                <td><span class="badge" [class.badge--active]="item.isActive">{{ item.isActive ? 'Yes' : 'No' }}</span></td>
                <td>{{ item.subscribedAt | date:'short' }}</td>
                <td class="actions-cell">
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
