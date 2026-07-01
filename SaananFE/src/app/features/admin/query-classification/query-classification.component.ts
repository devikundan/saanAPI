import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminQueryClassificationService } from './admin-query-classification.service';
import { QueryClassificationResponse } from '@core/models/query-classification.model';

@Component({
  selector: 'app-query-classification',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="admin-page">
      <div class="admin-page__header">
        <h1>AI Query Classifications</h1>
      </div>

      @if (isLoading()) {
        <p class="admin-loading">Loading...</p>
      } @else {
        <table class="admin-table">
          <thead><tr><th>Query</th><th>Category</th><th>Confidence</th><th>Suggested Service</th><th>Date</th></tr></thead>
          <tbody>
            @for (item of items(); track item.id) {
              <tr>
                <td class="query-cell">{{ item.originalQuery }}</td>
                <td><span class="badge badge--active">{{ item.classifiedCategory }}</span></td>
                <td>{{ (item.confidenceScore * 100).toFixed(0) }}%</td>
                <td>{{ item.suggestedServiceSlug || '—' }}</td>
                <td>{{ item.classifiedAt | date:'short' }}</td>
              </tr>
            }
          </tbody>
        </table>
        @if (items().length === 0) {
          <p class="admin-loading">No classifications yet.</p>
        }
      }
    </div>
  `,
  styles: [`@use 'admin-crud'; .query-cell { max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }`]
})
export class QueryClassificationComponent implements OnInit {
  private readonly service = inject(AdminQueryClassificationService);

  readonly isLoading = signal(true);
  readonly items = signal<QueryClassificationResponse[]>([]);

  ngOnInit(): void {
    this.service.getRecent(50).subscribe({
      next: r => { this.isLoading.set(false); if (r.success && r.data) this.items.set(r.data); },
      error: () => this.isLoading.set(false)
    });
  }
}
