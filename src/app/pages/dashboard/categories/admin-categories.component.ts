import { Component } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { FormModalService } from '../../../shared/form-modal.service';
import { CategoryType } from '../../../models/categorie';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css',
})
export class AdminCategoriesComponent {
  constructor(
    private modalService: ModalService,
    private formModalService: FormModalService,
    private http: HttpClient
  ) {}

  /**
   * DECLARATIONS
   */
  categorie: CategoryType = {
    id: 0,
    name: '',
    parent_id: 0,
    slug: '',
    products: [],
  };

  categories: CategoryType[] = [];

  errorMessage$ = this.formModalService.errorMessage$;

  /**
   * ON INIT
   */
  ngOnInit() {
    this.fetchCategories();
  }

  /**
   * FONCTIONS
   */

  fetchCategories() {
    this.http
      .get<any[]>(`${environment.apiUrl}/categories`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.categories = data.sort((a, b) => a.name.localeCompare(b.name));
          console.log(data);
        },
        error: (err) => {
          console.error('Erreur lors du fetch des catégories', err);
        },
      });
  }

  addCategorieAction(datas: CategoryType) {
    this.http
      .post<any[]>(`${environment.apiUrl}/categories`, datas, { withCredentials: true })
      .subscribe({
        next: (data) => {
          return data;
        },
        error: (err) => {
          console.error('Erreur lors du fetch des catégories', err);
          const msg =
            err?.error?.message || 'Une erreur est survenue lors de l’ajout.';
          this.formModalService.setError(msg);
        },
      });
  }

  addCategory() {
    // this.modalService.setDynamicComponent(LoginComponent);
    this.modalService.open('Ajouter une catégorie');
    this.formModalService.openFormModal({
      title: 'Ajouter une catégorie',
      fields: [
        { label: 'Nom', name: 'name', type: 'text', required: true },
        // { label: 'Image URL', name: 'image', type: 'text' },
        // { label: 'Description', name: 'description', type: 'textarea' },
      ],
      onSubmit: async (data) => {
        console.log('Catégorie reçue :', data);
        const response = await this.addCategorieAction(data);
        console.log('response', response);
        this.fetchCategories();
        this.modalService.close();
        this.formModalService.close();
      },
    });
  }

  editCategory(cat: CategoryType) {
    this.modalService.open('Modifier une catégorie');
    this.formModalService.openFormModal({
      title: 'Modifier une catégorie',
      fields: [
        {
          label: 'Nom',
          name: 'name',
          type: 'text',
          required: true,
          value: cat.name,
        },
      ],
      onSubmit: (data) => {
        const updated = { ...cat, ...data };
        this.http
          .patch(`${environment.apiUrl}/categories/${cat.id}`, updated, {
            withCredentials: true,
          })
          .subscribe({
            next: () => {
              this.fetchCategories();
              this.modalService.close();
              this.formModalService.close();
            },
            error: (err) => {
              const msg =
                err?.error?.message || 'Erreur lors de la mise à jour.';
              this.formModalService.setError(msg);
            },
          });
      },
    });
  }

  deleteCategory(cat: CategoryType) {
    if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
      this.http
        .delete(`${environment.apiUrl}/categories/${cat.id}`, { withCredentials: true })
        .subscribe({
          next: () => this.fetchCategories(),
          error: (err) => {
            console.error('Erreur suppression', err);
          },
        });
    }
  }
}
