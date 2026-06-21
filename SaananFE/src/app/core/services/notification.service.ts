import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _idCounter = 0;
  private readonly _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  success(message: string): void {
    this.addToast('success', message);
  }

  error(message: string): void {
    this.addToast('error', message);
  }

  warning(message: string): void {
    this.addToast('warning', message);
  }

  info(message: string): void {
    this.addToast('info', message);
  }

  removeToast(id: number): void {
    this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  private addToast(type: ToastMessage['type'], message: string): void {
    const id = ++this._idCounter;
    this._toasts.update((toasts) => [...toasts, { id, type, message }]);
    setTimeout(() => this.removeToast(id), 5000);
  }
}
