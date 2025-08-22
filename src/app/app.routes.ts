import { Routes } from '@angular/router';
import { CategoriesComponent } from './pages/categories/categories.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CartCheckoutComponent } from './pages/checkout/cart/cart.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';
import { HomeComponent } from './pages/home/home.component';
import { PaymentCheckoutComponent } from './pages/checkout/payment/payment.component';
import { ConfirmationCheckoutComponent } from './pages/checkout/confirmation/confirmation.component';
import { CheckoutLayoutComponent } from './layout/checkout-layout/checkout-layout.component';
import { DeliveryCheckoutComponent } from './pages/checkout/delivery/delivery.component';
import { adminGuard } from './guards/auth.guard.js';
import { customerGuard } from './guards/customer.guard.js';
export const routes: Routes = [
  {
    path: 'dashboard',
    // canActivate: [adminGuard],
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '',  component: HomeComponent  },
      { path: 'tasks', component: TasksComponent },
      { path: 'categories', component: CategoriesComponent },
      // { path: 'cart', component: CartComponent },
      { path: 'roadmap', component: RoadmapComponent },
      // autres routes...
      /** routes spécifiques */
      {
        path: 'categories/:slug',
        loadComponent: () =>
          import('./pages/categories/category-detail.component').then(
            (m) => m.CategoryDetailComponent
          ),
      },
      {
        path: 'products/:slug',
        loadComponent: () =>
          import('./pages/products/products.component').then(
            (m) => m.ProductsComponent
          ),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: 'checkout',
    component: CheckoutLayoutComponent,
    children: [
      { path: 'cart', component: CartCheckoutComponent },
      { path: 'delivery', component: DeliveryCheckoutComponent , canActivate: [customerGuard]},
      { path: 'payment', component: PaymentCheckoutComponent, canActivate: [customerGuard] },
      { path: 'confirmation', component: ConfirmationCheckoutComponent, canActivate: [customerGuard] },

    ],
  },

  /** Route par défault -- 404  */
  // {
  //   path: 'not-found',
  //   component: MainLayoutComponent,
  //   children: [{ path: '**', component: PageNotFoundComponent }],
  // },
  // { path: '**', redirectTo: 'not-found' },

  { path: '**', component: MainLayoutComponent ,children: [
    { path: '**', component: PageNotFoundComponent }] },
];
