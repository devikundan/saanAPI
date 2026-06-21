import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lead-confirmation',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="confirmation">
      <div class="container">
        <div class="confirmation__card">
          <div class="confirmation__icon">✓</div>
          <h1>Thank You!</h1>
          <p>Your inquiry has been submitted successfully. Our team will review your request and get back to you within 24 hours.</p>
          <div class="confirmation__actions">
            <a routerLink="/" class="btn btn--primary">Back to Home</a>
            <a routerLink="/services" class="btn btn--secondary">View Services</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .confirmation {
      padding: 4rem 0;
    }

    .confirmation__card {
      max-width: 500px;
      margin: 0 auto;
      text-align: center;
      padding: 3rem;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
    }

    .confirmation__icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--color-success);
      color: #fff;
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    h1 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
    }

    p {
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .confirmation__actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  `]
})
export class LeadConfirmationComponent {}
