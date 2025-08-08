import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CategoryType } from '../models/categorie';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private baseUrl = `${environment.apiUrl}/categories`;

  private readonly CACHE_KEY = 'cachedCategories';
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes en ms


  constructor(private http: HttpClient) {}

  // Créer un lien
  addCategory(category: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, category, {
      withCredentials: true,
    });
  }

  // Récupérer les liens pour un produit ou catégorie
  getCategories(): Observable<any[]> {
    const cachedRaw = localStorage.getItem(this.CACHE_KEY);

    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        const now = Date.now();

        if (cached.expiresAt && now < cached.expiresAt && cached.data) {
          return of(cached.data); // ✅ cache encore valide
        }
      } catch (err) {
        console.warn('Cache invalide, on refetch.', err);
        // on continue et refetch
      }
    }

    // ⚠️ cache absent ou expiré → fetch depuis API
    return this.http.get<any[]>('/api/categories').pipe(
      tap((data) => {
        const payload = {
          data,
          expiresAt: Date.now() + this.CACHE_TTL,
        };
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(payload));
      })
    );
  }

  clearCache() {
    localStorage.removeItem(this.CACHE_KEY);
  }


  // Récupérer les liens pour un produit ou catégorie
  getCategoriesToAdministrate(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(`${this.baseUrl}`);
  }

  getCategoriesBySlug(slug:string): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(`${this.baseUrl}/slug/${slug}`);
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
