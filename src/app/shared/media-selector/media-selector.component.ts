import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MediaType } from '../../models/medias.js';
import { MediasService } from '../../services/medias.service';
@Component({
  selector: 'app-media-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-selector.component.html',
  styleUrl: './media-selector.component.css'
})
export class MediaSelectorComponent {
  @Input() selectedMedia: MediaType[] = [];
  @Output() selectionChange = new EventEmitter<MediaType[]>();

  constructor(
    private mediaService: MediasService
  ) {}

  medias: MediaType[] = [];


  // Appelé lorsqu'on sélectionne plusieurs médias
  onSelectMedia(newSelection: MediaType[]) {
    this.selectedMedia = newSelection;
    this.selectionChange.emit(this.selectedMedia); // émet bien un tableau
    console.log(this.selectedMedia)
  }

  isSelected(media: MediaType): boolean {
    return this.selectedMedia.some((m) => m.id === media.id);
  }

  toggleMediaSelection(media: MediaType): void {
    if (this.isSelected(media)) {
      // retirer
      this.selectedMedia = this.selectedMedia.filter((m) => m.id !== media.id);
    } else {
      // ajouter
      this.selectedMedia = [...this.selectedMedia, media];
    }

    this.onSelectMedia(this.selectedMedia); // déclenche l'event
  }

    /**
   * ON INIT
   */
    ngOnInit() {
      this.getMedias();
    }

    getOptimizedImageUrl(
      url: string | undefined,
      width: number,
      height: number
    ): string {
      const transformation = `w_${width},h_${height},c_fill`;
      if (url) {
        return url.replace('/upload/', `/upload/${transformation}/`);
      } else {
        return '';
      }
    }

    getMedias() {
      this.mediaService.getMedias().subscribe({
        next: (data) => {
          this.medias = data.sort((a, b) => a.title.localeCompare(b.title));
          console.log(data);
        },
        error: (err) => {
          console.error('Erreur lors du fetch des catégories', err);
        },
      });
    }

}
