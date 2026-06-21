import { Routes } from '@angular/router';

export const leadsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lead-form/lead-form.component').then((m) => m.LeadFormComponent)
  },
  {
    path: 'confirmation',
    loadComponent: () =>
      import('./lead-confirmation/lead-confirmation.component').then((m) => m.LeadConfirmationComponent)
  }
];
