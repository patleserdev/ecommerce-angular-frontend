import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoriesService } from '../../services/categories.service.js';
@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule,RouterLink,MatProgressSpinnerModule],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']

})
export class CategoryDetailComponent {

  constructor(private categoriesService:CategoriesService ){}
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  category: any = null;
  isLoading = false;
  hasError = false;
  // Valable pour un produit par exemple qui ne change pas  mais pas pour une route dynamique
  // ngOnInit() {
  //   const slug = this.route.snapshot.paramMap.get('slug');
  //   this.http.get(`${environment.apiUrl}/categories/slug/${slug}`, { withCredentials: true }).subscribe({
  //     next: (data) => {
  //       this.category = data;
  //       console.log(data)
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors du fetch de la catégorie :', err);
  //     }
  //   });
  // }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchCategory(slug);
      }
    });
  }

  fetchCategory(slug: string) {
    this.isLoading = true;
    this.hasError = false;
    this.category = null;


      // this.http.get(`${environment.apiUrl}/categories/slug/${slug}`, { withCredentials: true })
      this.categoriesService.getCategoriesBySlug(slug)
      .subscribe({
        next: (data) => {
          this.category = data;
          this.isLoading = false;
          // console.log("categorydetailsfetch",data);
        },
        error: (err) => {
          console.error('Erreur lors du fetch de la catégorie :', err);
          this.hasError = true;
          this.isLoading = false;
        }
      });


  }

}
