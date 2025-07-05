import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="category">
      <h2 class="text-2xl font-bold mb-4">{{ category.name }}</h2>
      <p>Slug: {{ category.slug }}</p>
      <p>Produits: {{ category.products?.length || 0 }}</p>
      <!-- Tu peux ajouter ici un affichage des produits -->
    </div>
    <div *ngIf="!category">Chargement ou catégorie introuvable...</div>
  `
})
export class CategoryDetailComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  category: any = null;

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.http.get(`/api/categories/slug/${slug}`, { withCredentials: true }).subscribe({
      next: (data) => {
        this.category = data;
        console.log(data)
      },
      error: (err) => {
        console.error('Erreur lors du fetch de la catégorie :', err);
      }
    });
  }
}
