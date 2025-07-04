import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class DashboardHomeComponent {

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

  get filteredLinks() {
    return this.links.filter(link => link.path !== this.router.url);
  }

}
