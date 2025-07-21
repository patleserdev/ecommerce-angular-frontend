import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductType, ProductVariationsType } from '../../models/product.js';
import { CartService } from '../../services/cart.service.js';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  constructor(private cartService: CartService) {}

  product: any = null;
  isLoading = false;
  hasError = false;

  // ngOnInit() {
  //   this.route.paramMap.subscribe(params => {
  //     const slug = params.get('slug');
  //     if (slug) {
  //      console.log(slug)
  //     }
  //   });
  // }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchProductBySlug(slug);
      }
    });
  }

  addProductToCart(product:ProductType, variation: ProductVariationsType) {
    //console.log(productId, variation);
    this.cartService.add({ product, variation });
  }

  deleteProductFromCart(productId: number, variationId: number) {
    this.cartService.removeFromCartByVariationId(productId, variationId);
  }

  fetchProductBySlug(slug: string) {
    this.isLoading = true;
    this.hasError = false;
    this.product = null;

    this.http
      .get(`${environment.apiUrl}/products/slug/${slug}`, {
        withCredentials: true,
      })
      .subscribe({
        next: (data) => {
          this.product = data;

          console.log(data);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du fetch de la catégorie :', err);
          this.hasError = true;
          this.isLoading = false;
        },
      });
  }
}
