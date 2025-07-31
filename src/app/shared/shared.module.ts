import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { FormModalComponent } from './form-modal/form-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MediaSelectorComponent } from './media-selector/media-selector.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PictureModalComponent } from '../picture-modal/picture-modal.component';

@NgModule({
  declarations: [ModalComponent,PictureModalComponent],
  imports: [CommonModule,ReactiveFormsModule,MediaSelectorComponent,FormModalComponent,MatProgressSpinnerModule],
  exports: [ModalComponent,FormModalComponent,MatProgressSpinnerModule] // ⬅️ Important pour pouvoir utiliser <app-modal> ailleurs
})
export class SharedModule {}
