import { Routes } from '@angular/router';

export const servicesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./services-list/services-list.component').then((m) => m.ServicesListComponent)
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./service-detail/service-detail.component').then((m) => m.ServiceDetailComponent)
  }
];
