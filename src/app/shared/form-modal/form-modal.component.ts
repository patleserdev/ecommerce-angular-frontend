import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormModalService } from '../form-modal.service.js';

interface FormField {
  label: string;
  value?: string;
  name: string;
  type: string;
  required?: boolean;
  options?: { label: string; value: string }[]; // pour les <select>
}

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
})
export class FormModalComponent implements OnInit {
  @Input() fields: FormField[] = [];
  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;
  errorMessage$ = this.formModalService.errorMessage$;

  constructor(
    private fb: FormBuilder,
    public formModalService: FormModalService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields'] && !changes['fields'].firstChange) {
      this.buildForm();
    }
  }

  buildForm() {
    const group: { [key: string]: any } = {};
    this.fields.forEach((field) => {
      group[field.name] = [
        field.value || '',
        field.required ? Validators.required : [],
      ];
    });
    this.form = this.fb.group(group);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
