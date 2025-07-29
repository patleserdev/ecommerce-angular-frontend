import { Component, Inject } from '@angular/core';
import { MODAL_DATA } from '../modal/modal.component'; // ajuster le chemin selon ton projet

@Component({
  selector: 'app-picture-modal',
  template: `
    <div class="p-4">
      <img
        *ngIf="data?.media_url"
        [src]="data.media_url"
        alt="Preview"
        class="w-full max-h-[60vh] object-contain rounded shadow border"
      />
    </div>
  `,
})
export class PictureModalComponent {
  constructor(@Inject(MODAL_DATA) public data: { media_url: string }) {
    // console.log('[PictureModalComponent] Data received :', data);
  }
}
