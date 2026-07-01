import { Routes } from '@angular/router';

export const contactRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./contact-form/contact-form.component').then((m) => m.ContactFormComponent)
  }
];
