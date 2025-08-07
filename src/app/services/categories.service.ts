import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryType } from '../models/categorie';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // Créer un lien
  addCategory(category: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, category, {
      withCredentials: true,
    });
  }

  // Récupérer les liens pour un produit ou catégorie
  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(`${this.baseUrl}`);
  }

  getCategoriesToSelect(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  updateCategory(id: number, data: Partial<CategoryType>) {
    return this.http.patch(`${this.baseUrl}/${id}`, data, {
      withCredentials: true,
    });
  }

  // Supprimer un lien
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
