import { Routes } from '@angular/router';
import { CategoriesComponent } from './pages/categories/categories.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CartComponent } from './cart/cart.component';
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
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      { path: 'tasks', component: TasksComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'cart', component: CartComponent },
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

  /** Route par défault -- 404  */
  // {
  //   path: 'not-found',
  //   component: MainLayoutComponent,
  //   children: [{ path: '**', component: PageNotFoundComponent }],
  // },
  // { path: '**', redirectTo: 'not-found' },

  { path: '**', component: PageNotFoundComponent  },
];
