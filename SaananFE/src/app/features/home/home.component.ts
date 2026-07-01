import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">Innovative IT Solutions for Your Business</h1>
          <p class="hero__subtitle">
            We deliver cutting-edge technology services that drive growth,
            streamline operations, and accelerate digital transformation.
          </p>
          <div class="hero__actions">
            <a routerLink="/get-started" class="btn btn--primary">Get Started</a>
            <a routerLink="/services" class="btn btn--secondary">Our Services</a>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="features__title">Why Choose Saanan?</h2>
        <div class="features__grid">
          <div class="feature-card">
            <div class="feature-card__icon">⚡</div>
            <h3>Fast Delivery</h3>
            <p>Rapid development cycles with agile methodology to get your product to market faster.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">🛡️</div>
            <h3>Secure & Reliable</h3>
            <p>Enterprise-grade security and reliability built into every solution we deliver.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">📈</div>
            <h3>Scalable Solutions</h3>
            <p>Architecture designed to grow with your business from startup to enterprise.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <div class="cta__content">
          <h2>Ready to Transform Your Business?</h2>
          <p>Let's discuss how our IT solutions can help you achieve your goals.</p>
          <a routerLink="/get-started" class="btn btn--primary">Start Your Project</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      padding: 5rem 0;
      background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg) 100%);
    }

    .hero__content {
      max-width: 700px;
    }

    .hero__title {
      font-size: 3rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      color: var(--color-text);
    }

    .hero__subtitle {
      font-size: 1.25rem;
      color: var(--color-text-secondary);
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .hero__actions {
      display: flex;
      gap: 1rem;
    }

    .features {
      padding: 5rem 0;
    }

    .features__title {
      text-align: center;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 3rem;
    }

    .features__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      padding: 2rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      text-align: center;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: var(--shadow-md);
      }
    }

    .feature-card__icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }

    .cta {
      padding: 4rem 0;
      background: var(--color-bg-secondary);
    }

    .cta__content {
      text-align: center;
      max-width: 500px;
      margin: 0 auto;

      h2 {
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
      }

      p {
        color: var(--color-text-secondary);
        margin-bottom: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .hero__title {
        font-size: 2rem;
      }

      .hero__actions {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent {}
