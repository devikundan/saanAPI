import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-sidebar__brand">
          <a routerLink="/admin/dashboard">Saanan Admin</a>
        </div>
        <nav class="admin-sidebar__nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/admin/services" routerLinkActive="active">Services</a>
          <a routerLink="/admin/categories" routerLinkActive="active">Categories</a>
          <a routerLink="/admin/blogs" routerLinkActive="active">Blogs</a>
          <a routerLink="/admin/leads" routerLinkActive="active">Leads</a>
          <a routerLink="/admin/newsletter" routerLinkActive="active">Newsletter</a>
          <a routerLink="/admin/portfolio" routerLinkActive="active">Portfolio</a>
          <a routerLink="/admin/testimonials" routerLinkActive="active">Testimonials</a>
          <a routerLink="/admin/faqs" routerLinkActive="active">FAQs</a>
          <a routerLink="/admin/content" routerLinkActive="active">Content</a>
          <a routerLink="/admin/query-classification" routerLinkActive="active">AI Queries</a>
        </nav>
      </aside>

      <div class="admin-main">
        <header class="admin-header">
          <div class="admin-header__user">
            @if (authService.currentUser$ | async; as user) {
              <span>{{ user.fullName }}</span>
            }
            <button class="btn btn--secondary" (click)="authService.logout()">Logout</button>
          </div>
        </header>
        <div class="admin-content">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }

    .admin-sidebar {
      width: 250px;
      background: var(--color-text);
      color: #cbd5e1;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      overflow-y: auto;
    }

    .admin-sidebar__brand {
      padding: 1.5rem;
      border-bottom: 1px solid #334155;

      a {
        color: #fff;
        font-size: 1.125rem;
        font-weight: 700;
      }
    }

    .admin-sidebar__nav {
      display: flex;
      flex-direction: column;
      padding: 1rem 0;

      a {
        padding: 0.75rem 1.5rem;
        color: #94a3b8;
        font-size: 0.875rem;
        transition: all 0.2s;
        border-left: 3px solid transparent;

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        &.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          border-left-color: var(--color-primary);
        }
      }
    }

    .admin-main {
      flex: 1;
      margin-left: 250px;
      display: flex;
      flex-direction: column;
    }

    .admin-header {
      padding: 1rem 2rem;
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: flex-end;
    }

    .admin-header__user {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
    }

    .admin-content {
      padding: 2rem;
      background: var(--color-bg-secondary);
      flex: 1;
    }
  `]
})
export class AdminLayoutComponent {
  readonly authService = inject(AuthService);
}
