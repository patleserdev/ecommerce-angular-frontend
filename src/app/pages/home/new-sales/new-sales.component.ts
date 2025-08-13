import { Component } from '@angular/core';
import { ProductsService } from '../../../services/products.service.js';
import { ProductType } from '../../../models/product.js';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-sales',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './new-sales.component.html',
  styleUrl: './new-sales.component.css'
})
export class NewSalesComponent {
  constructor(private productsService: ProductsService) {}

  products:ProductType[]=[]
  isLoading=false
  hasError=false

  ngOnInit() {

        this.fetchNewsProducts();


  }

  fetchNewsProducts() {
    this.isLoading = true;
    this.hasError = false;

    // this.http.get(`${environment.apiUrl}/categories/slug/${slug}`, { withCredentials: true })
    this.productsService.getNewProducts(4).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
        console.log("nouveaux produits",data);
      },
      error: (err) => {
        console.error('Erreur lors du fetch des produits :', err);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }
}
