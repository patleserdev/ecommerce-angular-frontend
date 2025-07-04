import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCategoriesComponent } from './categories/admin-categories.component.js';
import { AdminProductsComponent } from './products/admin-products.component.js';
import { AdminBrandsComponent } from './brands/admin-brands.component.js';
import { AdminOrdersComponent } from './orders/admin-orders.component.js';
import { AdminInvoicesComponent } from './invoices/admin-invoices.component.js';
import { AdminMediasComponent } from './medias/admin-medias.component.js';
import { DashboardComponent } from './dashboard.component.js';
import { DashboardHomeComponent } from './home/home.component.js';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent, // Ton layout principal (sidebar, header, etc.)
    children: [
      { path: '', component:DashboardHomeComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'brands', component: AdminBrandsComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'invoices', component: AdminInvoicesComponent },
      { path: 'medias', component: AdminMediasComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {} // 👈 tu exportes ce module ici
