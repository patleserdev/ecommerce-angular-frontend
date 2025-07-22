import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaType } from '../models/medias';

@Injectable({
  providedIn: 'root',
})
export class MediasService {
  private baseUrl = '/api/medias'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  // Créer un lien
  addMedia(media: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, media);
  }

  // Récupérer les liens pour un produit ou catégorie
  getMedias(): Observable<MediaType[]> {
    return this.http.get<MediaType[]>(`${this.baseUrl}`);
  }

  // Récupérer les liens pour un produit ou catégorie
  getMediasByEntity(
    linkedType: 'product' | 'category' | 'brand',
    entityId: string
  ): Observable<MediaType[]> {
    return this.http.get<MediaType[]>(
      `${this.baseUrl}?entityType=${linkedType}&entityId=${entityId}`
    );
  }

  updateMedia(id: string, data: Partial<MediaType>) {
    return this.http.patch(`${this.baseUrl}/${id}`, data, {
      withCredentials: true,
    });
  }

  // Supprimer un lien
  deleteMedia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
