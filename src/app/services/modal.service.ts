import { Injectable,Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormModalService } from './form-modal.service';


@Injectable({
  providedIn: 'root',
})
export class ModalService {

  constructor(private formModalService: FormModalService) {}


  private modalVisibility = new BehaviorSubject<boolean>(false);
  private modalTitle = new BehaviorSubject<string>('');
  public visible$ = this.modalVisibility.asObservable();
  public title$ = this.modalTitle.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private modalData = new BehaviorSubject<any>(null);
modalData$ = this.modalData.asObservable();

setModalData(data: any) {
  this.modalData.next(data);
}


  setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }

  openWithComponent(title: string, component: Type<any>, data?: any) {
    this.modalTitle.next(title);
    this.setDynamicComponent(component);

    Promise.resolve().then(() => {
      this.setModalData(data || null);
      this.modalVisibility.next(true);
    });
  }



  open(title: string = '') {
    this.modalVisibility.next(false); // <-- Forcer le changement
    this.modalTitle.next(title);

    // Utilise setTimeout pour que le changement à true soit bien pris en compte
    setTimeout(() => this.modalVisibility.next(true), 0);
  }

  close() {
    // 👉 Si un formulaire précédent est en attente, on le restaure
    if (this.formModalService.hasStack()) {
      this.formModalService.popFormModal();
    } else {
      // 👉 Sinon on ferme normalement
      this.modalVisibility.next(false);
      this.setLoading(false);
    }
  }

  private dynamicComponent = new BehaviorSubject<Type<any> | null>(null);
  dynamicComponent$ = this.dynamicComponent.asObservable();

  setDynamicComponent(component: Type<any>) {
    this.dynamicComponent.next(component);
  }
}
