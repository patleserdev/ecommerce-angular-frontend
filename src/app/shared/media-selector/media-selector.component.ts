import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MediaType } from '../../models/medias.js';

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

  // Appelé lorsqu'on sélectionne plusieurs médias
  onSelectMedia(newSelection: MediaType[]) {
    this.selectedMedia = newSelection;
    this.selectionChange.emit(this.selectedMedia); // émet bien un tableau
  }

}
