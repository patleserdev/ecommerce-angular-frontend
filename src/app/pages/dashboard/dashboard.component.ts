import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component.js';
import { FooterComponent } from '../../shared/footer/footer.component.js';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent,CommonModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/categories', label: 'Catégories' },
    { path: '/dashboard/brands', label: 'Marques' },
    { path: '/dashboard/products', label: 'Produits' },
    { path: '/dashboard/orders', label: 'Commandes' },
    { path: '/dashboard/invoices', label: 'Factures' },
    { path: '/dashboard/medias', label: 'Médiathèque' },
  ];
  constructor(private router: Router) {}

  getLinkClasses(path: string): Record<string, boolean> {
    const isActive = this.router.url === path;
    return {
      'text-white bg-blue-600 font-semibold': isActive,
      'text-gray-600 hover:bg-gray-100': !isActive,
    };
  }

  get currentLabel(): string {
    const found = this.links.find(link => link.path === this.router.url);
    return found ? found.label : 'Dashboard';
  }

}
