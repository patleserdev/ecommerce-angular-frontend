import { Component, Input,Type } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() visible = false;
  @Input() title: string | null = '';
  @Input() dynamicComponent!: Type<any>;
  closeCallback: () => void = () => {};

  close() {
    this.visible = false;
    this.closeCallback();
  }

}

