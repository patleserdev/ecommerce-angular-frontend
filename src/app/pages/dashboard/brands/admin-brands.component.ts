import { Component } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { FormModalService } from '../../../shared/form-modal.service.js';
import { HttpClient } from '@angular/common/http';
import { BrandType } from '../../../models/brands.js';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-brands.component.html',
  styleUrl: './admin-brands.component.css'
})
export class AdminBrandsComponent {
  constructor(
    private modalService: ModalService,
    private formModalService: FormModalService,
    private http: HttpClient
  ) {}

  /**
   * DECLARATIONS
   */
  brand: BrandType = {
    id: 0,
    name: '',
    slug: '',
  };

  brands: BrandType[] = [];

  errorMessage$ = this.formModalService.errorMessage$;

  /**
   * ON INIT
   */
  ngOnInit() {
    this.fetchBrands();
  }

  /**
   * FONCTIONS
   */

  fetchBrands() {
    this.http
      .get<any[]>(`${environment.apiUrl}/brands`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.brands = data.sort((a, b) => a.name.localeCompare(b.name));
          console.log(data);
        },
        error: (err) => {
          console.error('Erreur lors du fetch des marques', err);
        },
      });
  }

  addBrandAction(datas: BrandType) {
    // this.http
    //   .post<any[]>(`${environment.apiUrl}/brands`, datas, { withCredentials: true })
    //   .subscribe({
    //     next: (data) => {
    //       return data;
    //     },
    //     error: (err) => {
    //       console.error('Erreur lors du fetch des marques', err);
    //       const msg =
    //         err?.error?.message || 'Une erreur est survenue lors de l’ajout.';
    //       this.formModalService.setError(msg);
    //     },
    //   });
    return this.http.post<any>(`${environment.apiUrl}/brands`, datas, {
      withCredentials: true,
    });
  }

  addBrand() {
    // this.modalService.setDynamicComponent(LoginComponent);
    this.modalService.open('Ajouter une marque');
    this.formModalService.openFormModal({
      title: 'Ajouter une Marque',
      fields: [
        { label: 'Nom', name: 'name', type: 'text', required: true },
        // { label: 'Image URL', name: 'image', type: 'text' },
        // { label: 'Description', name: 'description', type: 'textarea' },
      ],
      onSubmit: async (data) => {
        console.log('Catégorie reçue :', data);
        // const response = await this.addBrandAction(data);
        // console.log('response', response);
        // this.fetchBrands();
        // this.modalService.close();
        // this.formModalService.close();
        this.addBrandAction(data).subscribe({
          next: (res) => {
            this.fetchBrands();
            this.modalService.close();
            this.formModalService.close();
          },
          error: (err) => {
            const msg = err?.error?.message || 'Erreur lors de l’ajout.';
            this.formModalService.setError(msg);
          },
        });
      },
    });
  }

  editBrand(brand: BrandType) {
    this.modalService.open('Modifier une marque');
    this.formModalService.openFormModal({
      title: 'Modifier une marque',
      fields: [
        {
          label: 'Nom',
          name: 'name',
          type: 'text',
          required: true,
          value: brand.name,
        },
      ],
      onSubmit: (data) => {
        const updated = { ...brand, ...data };
        this.http
          .patch(`${environment.apiUrl}/brands/${brand.id}`, updated, {
            withCredentials: true,
          })
          .subscribe({
            next: () => {
              this.fetchBrands();
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

  deleteBrand(brand: BrandType) {
    if (confirm(`Supprimer la catégorie "${brand.name}" ?`)) {
      this.http
        .delete(`${environment.apiUrl}/brands/${brand.id}`, { withCredentials: true })
        .subscribe({
          next: () => this.fetchBrands(),
          error: (err) => {
            console.error('Erreur suppression', err);
          },
        });
    }
  }

}
