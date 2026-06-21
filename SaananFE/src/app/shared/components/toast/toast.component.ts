import { Component, inject } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" (click)="notificationService.removeToast(toast.id)">
          <span class="toast__message">{{ toast.message }}</span>
          <button class="toast__close">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 360px;
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.875rem 1rem;
      border-radius: var(--radius-md);
      color: #fff;
      font-size: 0.875rem;
      box-shadow: var(--shadow-lg);
      cursor: pointer;
      animation: slideIn 0.3s ease;
    }

    .toast--success { background: var(--color-success); }
    .toast--error { background: var(--color-error); }
    .toast--warning { background: var(--color-warning); color: #1e293b; }
    .toast--info { background: var(--color-primary); }

    .toast__close {
      background: none;
      color: inherit;
      font-size: 1.25rem;
      line-height: 1;
      margin-left: 0.75rem;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
  readonly notificationService = inject(NotificationService);
}
