import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { FormModalComponent } from './form-modal/form-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MediaSelectorComponent } from './media-selector/media-selector.component';

@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule,ReactiveFormsModule,MediaSelectorComponent,FormModalComponent],
  exports: [ModalComponent,FormModalComponent] // ⬅️ Important pour pouvoir utiliser <app-modal> ailleurs
})
export class SharedModule {}
