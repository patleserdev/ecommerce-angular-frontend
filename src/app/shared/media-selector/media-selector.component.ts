import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MediaType } from '../../models/medias.js';
import { MediasService } from '../../services/medias.service';
import { FormsModule } from '@angular/forms';
import { MediaDialogService } from '../../services/media-dialog.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-media-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './media-selector.component.html',
  styleUrl: './media-selector.component.css',
})
export class MediaSelectorComponent implements OnInit, OnChanges {
  @Input() selectedMedia: MediaType[] = [];
  @Output() selectionChange = new EventEmitter<MediaType[]>();

  constructor(
    private mediaService: MediasService,
    private mediaDialogService: MediaDialogService,
    private modalService: ModalService
  ) {}

  /** Gestion de la taille de grille */
  selectedOption = '3'; // valeur par défaut
  options = ['1', '2', '3', '4', '5', '6'];
  gridColsClass: { [key: string]: string } = {
    '1': 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1',
    '2': 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2',
    '3': 'sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3',
    '4': 'sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4',
    '5': 'sm:grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5',
    '6': 'sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6',
  };
  medias: MediaType[] = [];
  private modalSub?: Subscription;

  refreshAvailableMedia() {
    this.mediaService.getMedias().subscribe((mediaList) => {
      this.medias = mediaList;
    });
  }

  openAddMediaModal() {
    this.mediaDialogService.openMediaModal((newMedia) => {
      // Ajoute automatiquement le média dans la sélection
      this.selectedMedia.push(newMedia);
      this.selectionChange.emit(this.selectedMedia);
      this.refreshAvailableMedia(); // ← recharge la liste (optionnel)
      if (newMedia && !this.selectedMedia.some(m => m.id === newMedia.id)) {
        this.selectedMedia.push(newMedia);
      }
    });
  }
  // Appelé lorsqu'on sélectionne plusieurs médias
  onSelectMedia(newSelection: MediaType[]) {
    this.selectedMedia = newSelection;
    this.selectionChange.emit(this.selectedMedia); // émet bien un tableau
    console.log(this.selectedMedia);
  }

  // isSelected(media: MediaType): boolean {
  //   return this.selectedMedia.some((m) => m.id === media.id);
  // }
  isSelected(media: MediaType): boolean {
    if (!media || !media.id) return false;
    return this.selectedMedia?.some((m) => m?.id === media.id);
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
    console.log(this.selectedMedia);
    this.refreshAvailableMedia();
    // 🔁 S’abonne à l’affichage du modal pour détecter les retours
    this.modalSub = this.modalService.visible$.subscribe((visible) => {
      if (visible) {
        // À chaque réouverture, on recharge les médias
        this.refreshAvailableMedia();
      }
    });
  }

  ngOnDestroy() {
    this.modalSub?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMedia']) {
      let selected = changes['selectedMedia'].currentValue;

      // 🔥 Correction ici : détection de double tableau
      if (
        Array.isArray(selected) &&
        selected.length === 1 &&
        Array.isArray(selected[0])
      ) {
        selected = selected[0]; // dé-nesting
      }

      console.log('🔍 Valeurs initiales passées à selectedMedia :', selected);
      this.selectedMedia = selected || [];
    }
  }

  ngDoCheck() {
    if (this.selectedMedia && this.selectedMedia.length !== this._lastMediaCount) {
      this._lastMediaCount = this.selectedMedia.length;
      this.refreshAvailableMedia();
    }
  }

  private _lastMediaCount = 0;

  /** récupère la taille d'image optimisée sur cloudinary */
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

  /** récupère les medias */
  // getMedias() {
  //   this.mediaService.getMedias().subscribe({
  //     next: (data) => {
  //       this.medias = data.sort((a, b) => a.title.localeCompare(b.title));
  //       console.log(data);
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors du fetch des catégories', err);
  //     },
  //   });
  // }
  getMedias() {
    this.mediaService.getMedias().subscribe({
      next: (data) => {
        this.medias = data.sort((a, b) => a.title.localeCompare(b.title));

        // ✅ Rafraîchir la sélection visuelle une fois les objets bien alignés
        if (this.selectedMedia?.length) {
          const selectedIds = new Set(this.selectedMedia.map((m) => m.id));
          this.selectedMedia = this.medias.filter((m) => selectedIds.has(m.id));
        }


        console.log('🎯 Medias après synchro :', this.medias);
        console.log('✅ SelectedMedia mis à jour :', this.selectedMedia);
      },
      error: (err) => {
        console.error('Erreur lors du fetch des médias', err);
      },
    });
  }
}
