import { Component, Input, Type } from '@angular/core';
import { ModalService } from '../../services/modal.service';

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

  constructor(public modalService: ModalService) {
    this.modalService.loading$.subscribe((val) => (this.loading = val));
  }

  loading: boolean = false;

  close() {
    this.visible = false;
    this.closeCallback();
  }
}
