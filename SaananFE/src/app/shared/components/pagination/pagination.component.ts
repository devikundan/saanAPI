import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div class="pagination" role="navigation" aria-label="Pagination">
      <button
        class="pagination__btn"
        [disabled]="currentPage() <= 1"
        (click)="pageChange.emit(currentPage() - 1)"
        aria-label="Previous page">
        &laquo; Prev
      </button>

      <span class="pagination__info">
        Page {{ currentPage() }} of {{ totalPages() }}
      </span>

      <button
        class="pagination__btn"
        [disabled]="currentPage() >= totalPages()"
        (click)="pageChange.emit(currentPage() + 1)"
        aria-label="Next page">
        Next &raquo;
      </button>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1.5rem 0;
    }

    .pagination__btn {
      padding: 0.5rem 1rem;
      background: var(--color-primary);
      color: #fff;
      border-radius: var(--radius-sm);
      font-size: 0.8125rem;
      font-weight: 500;
      transition: opacity 0.2s;

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &:not(:disabled):hover {
        opacity: 0.85;
      }
    }

    .pagination__info {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }
  `]
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();
}
