import { Routes } from "@angular/router";

export const storeFrontRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/store-front-layout/store-front-layout').then(m => m.StoreFrontLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home-page/home-page').then(m => m.HomePage)
      },
      {
        path: 'gender/:gender',
        loadComponent: () => import('./pages/gender-page/gender-page').then(m => m.GenderPage)
      },
      {
        path: 'product/:product_id',
        loadComponent: () => import('./pages/product-page/product-page').then(m => m.ProductPage)
      },
      {
        path: '**',
        loadComponent: () => import('./pages/not-found-page/not-found-page').then(m => m.NotFoundPage)
      }
    ],
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export default storeFrontRoutes;
