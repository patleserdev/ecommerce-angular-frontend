import { Component ,inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

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
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchProductBySlug(slug);
      }
    });
  }

  fetchProductBySlug(slug: string) {
    this.isLoading = true;
    this.hasError = false;
    this.product = null;


      this.http
      .get(`${environment.apiUrl}/products/slug/${slug}`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.product = data;
          this.isLoading = false;
          console.log(data);
        },
        error: (err) => {
          console.error('Erreur lors du fetch de la catégorie :', err);
          this.hasError = true;
          this.isLoading = false;
        }
      });
    }

}
