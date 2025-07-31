import { Routes } from "@angular/router";

export const storeFrontRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/store-front-layout/store-front-layout').then(m => m.StoreFrontLayout),
    children: [

    ],
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export default storeFrontRoutes;
