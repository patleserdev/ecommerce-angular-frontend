import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterLink } from '@angular/router';
import { AdminCategoriesComponent } from './categories/admin-categories.component';
import { AdminProductsComponent } from './products/admin-products.component';
import { AdminBrandsComponent } from './brands/admin-brands.component';
import { AdminOrdersComponent } from './orders/admin-orders.component';
import { AdminInvoicesComponent } from './invoices/admin-invoices.component';
import { AdminMediasComponent } from './medias/admin-medias.component';
import { DashboardHomeComponent } from './home/home.component';
import { adminGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent, // Ton layout principal (sidebar, header, etc.)
    children: [
      { path: '', component:DashboardHomeComponent },
      { path: 'categories', component: AdminCategoriesComponent, canActivate: [adminGuard] },
      { path: 'products', component: AdminProductsComponent, canActivate: [adminGuard] },
      { path: 'brands', component: AdminBrandsComponent, canActivate: [adminGuard] },
      { path: 'orders', component: AdminOrdersComponent, canActivate: [adminGuard] },
      { path: 'invoices', component: AdminInvoicesComponent, canActivate: [adminGuard] },
      { path: 'medias', component: AdminMediasComponent, canActivate: [adminGuard] }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    // autres composants
  ],
  imports: [CommonModule, RouterModule.forChild(routes),
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    RouterLink,
  ],
  exports: [RouterModule,HeaderComponent,FooterComponent,RouterLink]
})
export class DashboardModule {}
