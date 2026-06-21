import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container header__inner">
        <a routerLink="/" class="header__logo">
          <span class="header__logo-text">Saanan</span>
        </a>

        <button class="header__toggle" (click)="toggleMenu()" [attr.aria-expanded]="isMenuOpen">
          <span class="header__toggle-bar"></span>
          <span class="header__toggle-bar"></span>
          <span class="header__toggle-bar"></span>
        </button>

        <nav class="header__nav" [class.header__nav--open]="isMenuOpen">
          <a routerLink="/services" routerLinkActive="active" (click)="closeMenu()">Services</a>
          <a routerLink="/portfolio" routerLinkActive="active" (click)="closeMenu()">Portfolio</a>
          <a routerLink="/blog" routerLinkActive="active" (click)="closeMenu()">Blog</a>
          <a routerLink="/faq" routerLinkActive="active" (click)="closeMenu()">FAQ</a>
          <a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">Contact</a>
          <a routerLink="/get-started" class="btn btn--primary header__cta" (click)="closeMenu()">Get Started</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      padding: 1rem 0;
    }

    .header__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header__logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .header__nav {
      display: flex;
      align-items: center;
      gap: 2rem;

      a {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        transition: color 0.2s;

        &:hover,
        &.active {
          color: var(--color-primary);
        }
      }
    }

    .header__toggle {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      padding: 4px;
    }

    .header__toggle-bar {
      width: 24px;
      height: 2px;
      background: var(--color-text);
      border-radius: 2px;
    }

    .header__cta {
      color: #fff !important;
      padding: 0.5rem 1.25rem;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .header__toggle {
        display: flex;
      }

      .header__nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: var(--color-bg);
        padding: 1.5rem;
        border-bottom: 1px solid var(--color-border);
        box-shadow: var(--shadow-md);

        &--open {
          display: flex;
        }
      }
    }
  `]
})
export class HeaderComponent {
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
