import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MediaLinkType, MediaType } from '../../models/medias.js';
import { MediasService } from '../../services/medias.service';
import { MediaDialogService } from '../../services/media-dialog.service';
import { ModalService } from '../../services/modal.service';
import { FormModalService } from '../../services/form-modal.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-media-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './media-selector.component.html',
  styleUrl: './media-selector.component.css',
})
export class MediaSelectorComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() selectedMedia: MediaType[] = [];
  @Output() selectionChange = new EventEmitter<MediaType[]>();

  medias: MediaType[] = [];
  selectedOption = '3';
  options = ['1', '2', '3', '4', '5', '6'];
  gridColsClass: Record<string, string> = {
    '1': 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1',
    '2': 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2',
    '3': 'sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3',
    '4': 'sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4',
    '5': 'sm:grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5',
    '6': 'sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6',
  };

  drop(event: CdkDragDrop<MediaType[]>) {
    moveItemInArray(
      this.selectedMedia,
      event.previousIndex,
      event.currentIndex
    );
    // Réattribuer les positions
    this.selectedMedia = this.selectedMedia.map((media, index) => ({
      ...media,
      position: index,
    }));
    this.selectionChange.emit(this.selectedMedia); // 🔁 renvoyer les objets complets avec `position`
  }

  private modalSub?: Subscription;
  private formSub?: Subscription;

  constructor(
    private mediaService: MediasService,
    private mediaDialogService: MediaDialogService,
    private modalService: ModalService,
    private formModalService: FormModalService,
    private cdr: ChangeDetectorRef
  ) {}

  get selectedMediaSorted(): MediaType[] {
    console.log('selectedMediaNonSorted', this.selectedMedia);
    console.log(
      'selectedMediaSorted',
      [...this.selectedMedia].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      )
    );
    return [...this.selectedMedia].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0)
    );
  }

  ngOnInit(): void {
    this.modalSub = this.modalService.visible$.subscribe((visible) => {
      if (visible) this.loadMedias();
    });

    this.formSub = this.formModalService.refresh$.subscribe(() => {
      this.loadMedias();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadMedias();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMedia']) {
      const selected = changes['selectedMedia'].currentValue;
      this.selectedMedia = Array.isArray(selected?.[0])
        ? selected[0]
        : selected || [];
    }
    console.log('au changement dans mediaselector', this.selectedMedia);
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
    this.formSub?.unsubscribe();
  }

  loadMedias(): void {
    this.mediaService.getMedias().subscribe({
      next: (mediaList) => {
        this.medias = mediaList;
        if (this.selectedMedia?.length) {
          const selectedIds = new Set(this.selectedMedia.map((m) => m.id));
          this.selectedMedia = this.selectedMedia.map((old) => {
            const fresh = this.medias.find((m) => m.id === old.id);
            return fresh ? { ...fresh, position: old.position } : old;
          });

          this.selectionChange.emit(this.selectedMedia);
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur lors du fetch des médias', err),
    });
  }

  openAddMediaModal(): void {
    this.mediaDialogService.openMediaModal((newMedia) => {
      if (!newMedia) return;

      // Ajout immédiat dans la vue
      this.medias = [newMedia, ...this.medias];

      // Ajout à la sélection si nouveau
      if (!this.selectedMedia.some((m) => m.id === newMedia.id)) {
        this.selectedMedia = [...this.selectedMedia, newMedia];
        this.selectionChange.emit(
          this.selectedMedia.map((m, i) => ({
            ...m,
            position: i,
          }))
        );
      }

      // Mise à jour des données
      this.loadMedias();
    });
  }

  isSelected(media: MediaType): boolean {
    return !!media?.id && this.selectedMedia.some((m) => m.id === media.id);
  }

  toggleMediaSelection(media: MediaType): void {
    const exists = this.isSelected(media);

    if (exists) {
      this.selectedMedia = this.selectedMedia.filter((m) => m.id !== media.id);
    } else {
      this.selectedMedia = [...this.selectedMedia, media];
    }

    // 🧠 Réassigner les positions après chaque changement
    this.selectedMedia = this.selectedMedia.map((m, index) => ({
      ...m,
      position: index,
    }));

    this.selectionChange.emit(
      this.selectedMedia.map((m, i) => ({
        ...m,
        position: i,
      }))
    );
  }

  onSelectMedia(selection: MediaType[]): void {
    this.selectedMedia = selection;
    this.selectionChange.emit(
      this.selectedMedia.map((m, i) => ({
        ...m,
        position: i,
      }))
    );
  }

  getOptimizedImageUrl(
    url: string | undefined,
    width: number,
    height: number
  ): string {
    return url
      ? url.replace('/upload/', `/upload/w_${width},h_${height},c_fill/`)
      : '';
  }
}
