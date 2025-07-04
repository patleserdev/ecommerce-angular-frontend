import { Routes } from '@angular/router';
import { CategoriesComponent } from './pages/categories/categories.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component.js';
export const routes: Routes = [
  // {
  //   path: '',
  //   component: AuthLayoutComponent,
  //   canActivate: [authGuard],
  //   children: [
  //     {path: 'dashboard',component: DashboardComponent},
  //   ]
  // },
  {
    path: 'dashboard',
    canActivate: [authGuard], // protège tout le dashboard
    loadChildren: () => import('./pages/dashboard/dashboard-routing.module')
      .then(m => m.DashboardRoutingModule)
  },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', component: TasksComponent },
      { path: 'categories', component: CategoriesComponent },
      // autres routes...
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
  // Route 404 à la toute fin
  { path: 'not-found',component: MainLayoutComponent,  children: [{path: '**' ,component: PageNotFoundComponent}  ]},
  { path: '**', redirectTo: 'not-found' },
];
