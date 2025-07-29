import { Component, Input, Type, Injector, InjectionToken } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormModalService } from '../../services/form-modal.service.js';

export const MODAL_DATA = new InjectionToken<any>('MODAL_DATA');

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  visible = false;
  title: string | null = '';
  dynamicComponent: Type<any> | null = null;
  dynamicInjector: Injector | undefined = undefined;
  loading: boolean = false;

  closeCallback: () => void = () => {};

  constructor(
    public modalService: ModalService,
    public formModalService: FormModalService, // public pour l'utiliser dans template
    private injector: Injector
  ) {
    this.modalService.visible$.subscribe((v) => (this.visible = v));
    this.modalService.title$.subscribe((t) => (this.title = t));
    this.modalService.loading$.subscribe((val) => (this.loading = val));
    this.modalService.dynamicComponent$.subscribe((component) => {
      this.dynamicComponent = component;
    });
    this.modalService.modalData$.subscribe((data) => {
      this.dynamicInjector = Injector.create({
        providers: [{ provide: MODAL_DATA, useValue: data }],
        parent: this.injector,
      });
      console.log(data)
    });
  }

  close() {
    this.visible = false;
    this.closeCallback();
    this.modalService.close();
  }
}
