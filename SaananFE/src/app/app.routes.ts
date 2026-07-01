import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  // Public routes with PublicLayout
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent)
      },
      {
        path: 'services',
        loadChildren: () =>
          import('./features/services/services.routes').then((m) => m.servicesRoutes)
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./features/blog/blog.routes').then((m) => m.blogRoutes)
      },
      {
        path: 'get-started',
        loadChildren: () =>
          import('./features/leads/leads.routes').then((m) => m.leadsRoutes)
      },
      {
        path: 'ai-assistant',
        loadChildren: () =>
          import('./features/ai-query/ai-query.routes').then((m) => m.aiQueryRoutes)
      },
      {
        path: 'portfolio',
        loadChildren: () =>
          import('./features/portfolio/portfolio.routes').then((m) => m.portfolioRoutes)
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./features/contact/contact.routes').then((m) => m.contactRoutes)
      },
      {
        path: 'faq',
        loadChildren: () =>
          import('./features/faq/faq.routes').then((m) => m.faqRoutes)
      },
      {
        path: 'testimonials',
        loadComponent: () =>
          import('./features/testimonials/testimonials-list/testimonials-list.component').then((m) => m.TestimonialsListComponent)
      }
    ]
  },

  // Admin login (no layout, no auth guard)
  {
    path: 'admin/login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/admin/login/login.component').then((m) => m.LoginComponent)
  },

  // Admin routes with AdminLayout (guarded)
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/admin/manage-services/manage-services.component').then((m) => m.ManageServicesComponent)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/admin/manage-categories/manage-categories.component').then((m) => m.ManageCategoriesComponent)
      },
      {
        path: 'blogs',
        loadComponent: () =>
          import('./features/admin/manage-blogs/manage-blogs.component').then((m) => m.ManageBlogsComponent)
      },
      {
        path: 'leads',
        loadComponent: () =>
          import('./features/admin/manage-leads/manage-leads.component').then((m) => m.ManageLeadsComponent)
      },
      {
        path: 'newsletter',
        loadComponent: () =>
          import('./features/admin/manage-newsletter/manage-newsletter.component').then((m) => m.ManageNewsletterComponent)
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./features/admin/manage-portfolio/manage-portfolio.component').then((m) => m.ManagePortfolioComponent)
      },
      {
        path: 'testimonials',
        loadComponent: () =>
          import('./features/admin/manage-testimonials/manage-testimonials.component').then((m) => m.ManageTestimonialsComponent)
      },
      {
        path: 'faqs',
        loadComponent: () =>
          import('./features/admin/manage-faqs/manage-faqs.component').then((m) => m.ManageFaqsComponent)
      },
      {
        path: 'content',
        loadComponent: () =>
          import('./features/admin/manage-content/manage-content.component').then((m) => m.ManageContentComponent)
      },
      {
        path: 'query-classification',
        loadComponent: () =>
          import('./features/admin/query-classification/query-classification.component').then((m) => m.QueryClassificationComponent)
      }
    ]
  },

  // Wildcard - 404
  {
    path: '**',
    redirectTo: ''
  }
];
