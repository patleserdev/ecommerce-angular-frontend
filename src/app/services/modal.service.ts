import { Injectable,Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalVisibility = new BehaviorSubject<boolean>(false);
  private modalTitle = new BehaviorSubject<string>('');
  public visible$ = this.modalVisibility.asObservable();
  public title$ = this.modalTitle.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }

  open(title: string = '') {
    this.modalVisibility.next(false); // <-- Forcer le changement
    this.modalTitle.next(title);

    // Utilise setTimeout pour que le changement à true soit bien pris en compte
    setTimeout(() => this.modalVisibility.next(true), 0);
  }

  close() {
    this.modalVisibility.next(false);
    this.setLoading(false)
  }

  private dynamicComponent = new BehaviorSubject<Type<any> | null>(null);
  dynamicComponent$ = this.dynamicComponent.asObservable();

  setDynamicComponent(component: Type<any>) {
    this.dynamicComponent.next(component);
  }
}
