import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="dialog-overlay" (click)="onCancel()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <h3 class="dialog__title">{{ title() }}</h3>
          <p class="dialog__message">{{ message() }}</p>
          <div class="dialog__actions">
            <button class="btn btn--secondary" (click)="onCancel()">Cancel</button>
            <button class="btn btn--danger" (click)="onConfirm()">{{ confirmText() }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease;
    }

    .dialog {
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 420px;
      width: 90%;
      box-shadow: var(--shadow-lg);
    }

    .dialog__title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .dialog__message {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .dialog__actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ConfirmDialogComponent {
  isOpen = input.required<boolean>();
  title = input<string>('Confirm Action');
  message = input<string>('Are you sure you want to proceed?');
  confirmText = input<string>('Delete');

  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
