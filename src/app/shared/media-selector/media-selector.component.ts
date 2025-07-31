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

import { MediaType } from '../../models/medias.js';
import { MediasService } from '../../services/medias.service';
import { MediaDialogService } from '../../services/media-dialog.service';
import { ModalService } from '../../services/modal.service';
import { FormModalService } from '../../services/form-modal.service';

@Component({
  selector: 'app-media-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './media-selector.component.html',
  styleUrl: './media-selector.component.css',
})
export class MediaSelectorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
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

  private modalSub?: Subscription;
  private formSub?: Subscription;

  constructor(
    private mediaService: MediasService,
    private mediaDialogService: MediaDialogService,
    private modalService: ModalService,
    private formModalService: FormModalService,
    private cdr: ChangeDetectorRef
  ) {}

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
      this.selectedMedia = Array.isArray(selected?.[0]) ? selected[0] : selected || [];
    }
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
    this.formSub?.unsubscribe();
  }

  loadMedias(): void {
    this.mediaService.getMedias().subscribe({
      next: (mediaList) => {
        // this.medias = mediaList.sort((a, b) => a.title.localeCompare(b.title));
        this.medias = mediaList
        if (this.selectedMedia?.length) {
          const selectedIds = new Set(this.selectedMedia.map((m) => m.id));
          this.selectedMedia = this.medias.filter((m) => selectedIds.has(m.id));
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
        this.selectionChange.emit(this.selectedMedia);
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

    this.selectedMedia = exists
      ? this.selectedMedia.filter((m) => m.id !== media.id)
      : [...this.selectedMedia, media];

    this.selectionChange.emit(this.selectedMedia);
  }

  onSelectMedia(selection: MediaType[]): void {
    this.selectedMedia = selection;
    this.selectionChange.emit(this.selectedMedia);
  }

  getOptimizedImageUrl(url: string | undefined, width: number, height: number): string {
    return url
      ? url.replace('/upload/', `/upload/w_${width},h_${height},c_fill/`)
      : '';
  }
}
