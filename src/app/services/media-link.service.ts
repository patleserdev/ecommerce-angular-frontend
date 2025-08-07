import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaLinkType } from '../models/medias';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaLinkService {
  private baseUrl = `${environment.apiUrl}/media-links`;

  constructor(private http: HttpClient) {}

  // Créer un lien
  createMediaLink(mediaLink: MediaLinkType): Observable<MediaLinkType> {
    return this.http.post<MediaLinkType>(this.baseUrl, mediaLink, {
      withCredentials: true,
    });
  }

  // Récupérer les liens pour un produit ou catégorie
  getMediaLinks(
    linkedType: 'product' | 'category' | 'brand',
    entityId: string
  ): Observable<MediaLinkType[]> {
    return this.http.get<MediaLinkType[]>(
      `${this.baseUrl}?entityType=${linkedType}&entityId=${entityId}`
    );
  }

  // Supprimer un lien
  deleteMediaLink(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  deleteMediaLinkByLinkedIdAndMediaId(
    linkedId: number,
    mediaId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}?linkedId=${linkedId}&mediaId=${mediaId}`,
      {
        withCredentials: true,
      }
    );
  }
}
