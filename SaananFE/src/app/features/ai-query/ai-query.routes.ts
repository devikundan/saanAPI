import { Routes } from '@angular/router';

export const aiQueryRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ai-query-page/ai-query-page.component').then((m) => m.AiQueryPageComponent)
  }
];
