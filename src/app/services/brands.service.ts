import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrandType } from '../models/brands.js';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private baseUrl = '/api/brands'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  // Créer un lien
  addBrand(brand: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, brand);
  }

  // Récupérer les liens pour un produit ou catégorie
  getBrands(): Observable<BrandType[]> {
    return this.http.get<BrandType[]>(`${this.baseUrl}`);
  }

  getBrandsToSelect(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }


  updateBrand(id: number, data: Partial<BrandType>) {
    return this.http.patch(`${this.baseUrl}/${id}`, data, {
      withCredentials: true,
    });
  }

  // Supprimer un lien
  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
