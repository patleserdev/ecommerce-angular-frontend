import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormModalComponent } from '../shared/form-modal/form-modal.component';

interface FormModalConfig {
  title: string;
  fields: any[];
  onSubmit: (data: any) => void;
}

@Injectable({ providedIn: 'root' })
export class FormModalService {
  public visible$ = new BehaviorSubject<boolean>(false);
  public title$ = new BehaviorSubject<string>('');
  public fields$ = new BehaviorSubject<any[]>([]);
  public errorMessage$ = new BehaviorSubject<string | null>(null);
  public refresh$ = new BehaviorSubject<void>(undefined);

  private onSubmitCallback: ((data: any) => void) | null = null;
  private formComponentRef: FormModalComponent | null = null;

  // Nouvelle pile de configs
  private formStack: FormModalConfig[] = [];

  hasStack(): boolean {
    return this.formStack.length > 0;
  }

  setFormComponentRef(ref: FormModalComponent) {
    this.formComponentRef = ref;
  }

  resetForm() {
    this.formComponentRef?.resetForm();
  }

  openFormModal(config: FormModalConfig) {
    this.title$.next(config.title);
    this.fields$.next(config.fields);
    this.onSubmitCallback = config.onSubmit;
    this.visible$.next(true);
    this.refresh$.next();
  }

  /** 👇 Push : sauvegarde le formulaire courant avant d’en ouvrir un autre */
  pushFormModal(config: FormModalConfig) {
    const currentConfig = this.getCurrentConfig();
    console.log('🔁 pushing current config:', currentConfig);

    if (currentConfig) {
      this.formStack.push(currentConfig); // sauvegarde le formulaire courant
    } else {
      console.warn('❌ getCurrentConfig() returned null, nothing pushed');
    }
    this.openFormModal(config); // nouveau
    this.refresh$.next();

  }

  /** 👇 Pop : restaure le formulaire précédent */
  popFormModal() {
    const previous = this.formStack.pop();
    console.log("previous",previous)
    if (previous) {
      this.openFormModal(previous);
    } else {
      this.close(); // fallback si rien à restaurer
    }
  }

  submit(data: any) {
    this.onSubmitCallback?.(data);
    this.close(); // optionnel si tu veux qu’il se ferme automatiquement
  }

  close() {
    const previous = this.formStack.pop();
    if (previous) {
      this.openFormModal(previous);
    } else {
      this.visible$.next(false);
    }
    this.clearError();
  }


  setError(message: string) {
    this.errorMessage$.next(message);
  }

  clearError() {
    this.errorMessage$.next(null);
  }

  /** Utile pour pushFormModal() */
  private getCurrentConfig(): FormModalConfig | null {
    const title = this.title$.getValue();
    const fields = this.fields$.getValue();
    const onSubmit = this.onSubmitCallback;

    console.log('📦 getCurrentConfig()', { title, fields, onSubmit });


    if (!title || !fields || !onSubmit) return null;
    return { title, fields, onSubmit };
  }
}
