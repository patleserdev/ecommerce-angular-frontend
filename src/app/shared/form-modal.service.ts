import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FormModalService {
  public visible$ = new BehaviorSubject<boolean>(false);
  public title$ = new BehaviorSubject<string>('');
  public fields$ = new BehaviorSubject<any[]>([]);
  private onSubmitCallback: ((data: any) => void) | null = null;

  public errorMessage$ = new BehaviorSubject<string | null>(null);


  openFormModal(config: {
    title: string;
    fields: any[];
    onSubmit: (data: any) => void;
  }) {
    console.log("form modal opened")
    this.title$.next(config.title);
    this.fields$.next(config.fields);
    this.onSubmitCallback = config.onSubmit;
    this.visible$.next(true);
  }

  submit(data: any) {
    this.onSubmitCallback?.(data);
    this.close();
  }

  close() {
    this.visible$.next(false);
  }

  setError(message: string) {
    this.errorMessage$.next(message);
  }

  clearError() {
    this.errorMessage$.next(null);
  }
}
