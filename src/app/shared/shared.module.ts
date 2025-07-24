import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { FormModalComponent } from './form-modal/form-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MediaSelectorComponent } from './media-selector/media-selector.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule,ReactiveFormsModule,MediaSelectorComponent,FormModalComponent,MatProgressSpinnerModule],
  exports: [ModalComponent,FormModalComponent,MatProgressSpinnerModule] // ⬅️ Important pour pouvoir utiliser <app-modal> ailleurs
})
export class SharedModule {}
