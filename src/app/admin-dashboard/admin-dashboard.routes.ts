import { Routes } from "@angular/router";

export const AdminDashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/admin-dashboard-layout/admin-dashboard-layout').then(m => m.AdminDashboardLayout),
    children: [
      {
        path: 'products',
        loadComponent: () => import('./pages/admin-products/admin-products').then(m => m.AdminProducts)
      },
      {
        path: 'product:/id',
        loadComponent: () => import('./pages/admin-product/admin-product').then(m => m.AdminProduct)
      },
      {
        path: '**',
        redirectTo: 'products'
      }
    ]
  },
];

export default AdminDashboardRoutes;
