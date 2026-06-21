import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__grid">
          <div class="footer__section">
            <h3 class="footer__title">Saanan</h3>
            <p class="footer__desc">
              Delivering innovative IT solutions that drive business growth and digital transformation.
            </p>
          </div>

          <div class="footer__section">
            <h4 class="footer__subtitle">Quick Links</h4>
            <nav class="footer__links">
              <a routerLink="/services">Services</a>
              <a routerLink="/portfolio">Portfolio</a>
              <a routerLink="/blog">Blog</a>
              <a routerLink="/contact">Contact</a>
            </nav>
          </div>

          <div class="footer__section">
            <h4 class="footer__subtitle">Company</h4>
            <nav class="footer__links">
              <a routerLink="/faq">FAQ</a>
              <a routerLink="/get-started">Get Started</a>
              <a routerLink="/ai-assistant">AI Assistant</a>
            </nav>
          </div>

          <div class="footer__section">
            <h4 class="footer__subtitle">Contact</h4>
            <div class="footer__contact">
              <p>info&#64;saanan.com</p>
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          <p>&copy; {{ currentYear }} Saanan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-text);
      color: #cbd5e1;
      padding: 4rem 0 2rem;
      margin-top: 4rem;
    }

    .footer__grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 2rem;
    }

    .footer__title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.75rem;
    }

    .footer__subtitle {
      font-size: 0.875rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .footer__desc {
      font-size: 0.875rem;
      line-height: 1.7;
    }

    .footer__links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      a {
        color: #cbd5e1;
        font-size: 0.875rem;
        transition: color 0.2s;

        &:hover {
          color: #fff;
        }
      }
    }

    .footer__contact p {
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .footer__bottom {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid #334155;
      text-align: center;
      font-size: 0.8125rem;
    }

    @media (max-width: 768px) {
      .footer__grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 480px) {
      .footer__grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
