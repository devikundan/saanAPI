import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-card__header">
          <h1>Saanan Admin</h1>
          <p>Sign in to manage your site</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              formControlName="email"
              type="email"
              placeholder="admin@saanan.com"
              autocomplete="username">
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <span class="error-message">Valid email is required</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              formControlName="password"
              [type]="showPassword() ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password">
            <button
              type="button"
              class="password-toggle"
              (click)="showPassword.set(!showPassword())">
              {{ showPassword() ? 'Hide' : 'Show' }}
            </button>
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <span class="error-message">Password is required</span>
            }
          </div>

          @if (errorMessage()) {
            <div class="login-error">
              <p>{{ errorMessage() }}</p>
            </div>
          }

          <button
            type="submit"
            class="btn btn--primary login-btn"
            [disabled]="form.invalid || isSubmitting()">
            {{ isSubmitting() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f1f5f9;
    }

    .login-page {
      width: 100%;
      max-width: 420px;
      padding: 1rem;
    }

    .login-card {
      background: #fff;
      border-radius: 12px;
      padding: 2.5rem 2rem;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }

    .login-card__header {
      text-align: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-primary, #1a56db);
        margin-bottom: 0.375rem;
      }

      p {
        font-size: 0.875rem;
        color: #64748b;
      }
    }

    .form-group {
      position: relative;
      margin-bottom: 1.25rem;

      label {
        display: block;
        font-size: 0.8125rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.375rem;
      }

      input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.9375rem;
        font-family: inherit;
        transition: border-color 0.2s;

        &:focus {
          outline: none;
          border-color: var(--color-primary, #1a56db);
          box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.1);
        }

        &::placeholder {
          color: #94a3b8;
        }
      }
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 34px;
      background: none;
      border: none;
      font-size: 0.75rem;
      color: #64748b;
      cursor: pointer;
      padding: 4px 6px;

      &:hover {
        color: #1e293b;
      }
    }

    .error-message {
      display: block;
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 0.25rem;
    }

    .login-error {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      margin-bottom: 1.25rem;

      p {
        font-size: 0.8125rem;
        color: #dc2626;
        margin: 0;
      }
    }

    .login-btn {
      width: 100%;
      padding: 0.875rem;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      background: var(--color-primary, #1a56db);
      color: #fff;
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover:not(:disabled) {
        opacity: 0.9;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal('');

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.login({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage.set(response.message || 'Invalid credentials.');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Invalid email or password.');
        } else if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('An error occurred. Please try again.');
        }
      }
    });
  }
}
