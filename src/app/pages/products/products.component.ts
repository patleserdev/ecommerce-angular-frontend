import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductType, ProductVariationsType } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { MediaLinkService } from '../../services/media-link.service';
import { MediaLinkType } from '../../models/medias';
import { ProductsService } from '../../services/products.service.js';
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

  constructor(
    private cartService: CartService,
    private mediaLinkService: MediaLinkService,
    private productService : ProductsService)
    {}

  product: any = null;
  isLoading = false;
  hasError = false;
  mediaLinks: MediaLinkType[] = [];


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

    this.productService.getProductBySlug(slug)

    // this.http
    //   .get(`${environment.apiUrl}/products/slug/${slug}`, {
    //     withCredentials: true,
    //   })
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

  loadMediaLinks(productId: string | number) {
    this.mediaLinkService.getMediaLinks('product', productId.toString()).subscribe({
      next: (links) => {
        this.mediaLinks = links;
      },
      error: (err) => {
        console.error('Erreur lors du fetch des mediaLinks :', err);
      },
    });
  }
}
