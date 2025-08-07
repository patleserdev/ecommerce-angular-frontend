import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormModalService } from '../../services/form-modal.service';
import { MediaType } from '../../models/medias';
import { MediaSelectorComponent } from '../media-selector/media-selector.component';
import { CommonModule } from '@angular/common';
import { Inject, Optional } from '@angular/core';
import { MODAL_DATA } from '../modal/modal.component';

MediaSelectorComponent;
interface FormField {
  label: string;
  value?: string;
  name: string;
  type: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  fields?: FormField[];
  returnFullObject?: boolean; // <-- ajout ici
}


@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  imports: [MediaSelectorComponent, ReactiveFormsModule, CommonModule],
  standalone: true, // <---- ici
})
export class FormModalComponent implements OnInit {
  @Input() fields: FormField[] = [];
  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;
  errorMessage$ = this.formModalService.errorMessage$;

  constructor(
    private fb: FormBuilder,
    public formModalService: FormModalService,
    @Optional() @Inject(MODAL_DATA) public modalData: any
  ) {
    if (modalData?.fields) {
      this.fields = modalData.fields;
    }
  }

  imagePreviewUrl: string | null = null;

  ngOnInit() {
    // Réagit aux changements de formulaire (pushFormModal, etc.)
    this.formModalService.refresh$.subscribe(() => {
      const newFields = this.formModalService.fields$.getValue();
      this.fields = newFields;
      this.buildForm();
    });

    // Initialise le formulaire une première fois si les champs sont passés en @Input ou modalData
    const initialFields = this.modalData?.fields || this.fields;
    if (initialFields && initialFields.length > 0) {
      this.fields = initialFields;
      this.buildForm();
    }

    this.buildForm();

    // 👇 Injecte dynamiquement comme "form courant"
  if (this.modalData?.onSubmit) {
    this.formModalService.openFormModal({
      title: this.modalData?.title || '',
      fields: this.fields,
      onSubmit: this.modalData.onSubmit,
    });
  }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields'] && !changes['fields'].firstChange) {
      this.buildForm();
    }
  }

  onFileChange(event: Event, fieldName: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Stocke le fichier dans le formControl ou autre logique
    this.form.get(fieldName)?.setValue(file);

    // Crée une URL pour l’aperçu
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onMediaSelectionChange(mediaArray: MediaType[], fieldName: string) {
    this.form.get(fieldName)?.setValue(mediaArray); // 👈 stocke les objets
  }

  buildForm() {
    const group: { [key: string]: any } = {};

    this.fields.forEach((field) => {
      if (field.type === 'array') {
        // On s'assure que field.value est un tableau, sinon on prend un tableau vide
        const valuesArray = Array.isArray(field.value) ? field.value : [];

        const controls = valuesArray.map((item: any) => {
          const fgGroup: { [key: string]: any } = {};
          if (field.fields && field.fields.length > 0) {
            field.fields.forEach((subField) => {
              fgGroup[subField.name] = [
                item[subField.name] || '',
                subField.required ? Validators.required : [],
              ];
            });
          }
          return this.fb.group(fgGroup);
        });

        group[field.name] = this.fb.array(controls);
      } else {
        group[field.name] = [
          field.value || '',
          field.required ? Validators.required : [],
        ];

        // 👇 Si c'est une image déjà uploadée, on prépare l'aperçu
        if (field.type === 'file' && typeof field.value === 'string') {
          this.imagePreviewUrl = field.value;
        }
      }
    });

    this.form = this.fb.group(group);
  }

  onSubmit() {
    if (this.form.valid) {
      const processedValue = { ...this.form.value };

      // Si tu veux filtrer pour n’envoyer que les ids :
      this.fields.forEach((field) => {
        if (field.type === 'mediaSelector') {
          if (field.returnFullObject) {
            // Tu gardes les objets complets
            processedValue[field.name] = processedValue[field.name] || [];
          } else {
            // Sinon tu transformes en tableau d'IDs (comportement par défaut)
            processedValue[field.name] = (processedValue[field.name] || []).map(
              (media: MediaType) => media.id
            );
          }
        }
      });

      // 👉 Exécute onSubmit s’il est présent dans modalData
      this.formModalService.submit(processedValue);


      this.submitForm.emit(processedValue);
    } else {
      this.form.markAllAsTouched();
    }
  }

  getFieldValue(fieldName: string): any {
    return this.form.get(fieldName)?.value;
  }

  addArrayItem(fieldName: string, fields: any[]) {
    const array = this.form.get(fieldName) as FormArray;
    const group = this.fb.group({});
    fields.forEach((f) => {
      group.addControl(
        f.name,
        this.fb.control('', f.required ? Validators.required : null)
      );
    });
    array.push(group);
  }

  removeArrayItem(fieldName: string, index: number) {
    const array = this.form.get(fieldName) as FormArray;
    array.removeAt(index);
  }

  getFormArray(name: string): FormArray {
    return this.form.get(name) as FormArray;
  }

  resetForm() {
    this.form.reset();
    this.imagePreviewUrl = null;

    // Réinitialisation manuelle des champs <input type="file">
    const fileInputs = document.querySelectorAll(
      'input[type="file"]'
    ) as NodeListOf<HTMLInputElement>;
    fileInputs.forEach((input) => {
      input.value = '';
    });
  }

  ngAfterViewInit(): void {
    this.formModalService.setFormComponentRef(this);
  }
}
