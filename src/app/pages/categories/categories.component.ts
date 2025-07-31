import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,RouterLink,MatProgressSpinnerModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})

export class CategoriesComponent {
  categories: any[] = [];
  isLoading = false;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.isLoading=true
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading=false
      },
      error: (err) => {
        console.error('Erreur lors du fetch des catégories', err);
        this.isLoading=false
      }
    });
  }
}
