import { Component, Input, Type } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormModalService } from '../../services/form-modal.service.js';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() visible = false;
  @Input() title: string | null = '';
  @Input() dynamicComponent!: Type<any>;
  closeCallback: () => void = () => {};

  constructor(public modalService: ModalService, private formModalService : FormModalService) {
    this.modalService.loading$.subscribe((val) => (this.loading = val));
  }

  loading: boolean = false;

  close() {
    this.visible = false;
    this.closeCallback();
    this.formModalService.resetForm();
  }
}
