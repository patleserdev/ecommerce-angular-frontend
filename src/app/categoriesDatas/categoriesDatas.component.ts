import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-categoriesDatas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoriesDatas.component.html',
  styleUrl: './categoriesDatas.component.css',
})
export class CategoriesDatasComponent implements OnInit {
  categories: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.http.get<any[]>('/api/categories', { withCredentials: true }).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Erreur lors du fetch des catégories', err);
      }
    });
  }
}
