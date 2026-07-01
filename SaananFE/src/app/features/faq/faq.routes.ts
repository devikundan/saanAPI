import { Routes } from '@angular/router';

export const faqRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./faq-list/faq-list.component').then((m) => m.FaqListComponent)
  }
];
