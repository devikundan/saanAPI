import { Routes } from '@angular/router';

export const portfolioRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./portfolio-list/portfolio-list.component').then((m) => m.PortfolioListComponent)
  }
];
