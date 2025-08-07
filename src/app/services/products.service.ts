import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductType } from '../models/product.js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // Créer un lien
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, product, {
      withCredentials: true,
    });
  }

  // Récupérer les liens pour un produit ou catégorie
  getProducts(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${this.baseUrl}`);
  }

  getProductBySlug(slug:string)
  {return this.http.get<ProductType[]>(`${this.baseUrl}/slug/${slug}`); }


  updateProduct(id: number, data: Partial<ProductType>) {
    return this.http.patch(`${this.baseUrl}/${id}`, data, {
      withCredentials: true,
    });
  }

  // Supprimer un lien
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
