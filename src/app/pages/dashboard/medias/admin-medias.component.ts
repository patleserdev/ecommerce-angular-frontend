import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { FormModalService } from '../../../shared/form-modal.service';
import { HttpClient } from '@angular/common/http';
import { MediaType } from '../../../models/medias';
import { environment } from '../../../../environments/environment';
import {
  CategoryToSelectType,
  CategoryType,
} from '../../../models/categorie.js';
import { BrandToSelectType } from '../../../models/brands.js';

@Component({
  selector: 'app-admin-medias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-medias.component.html',
  styleUrl: './admin-medias.component.css',
})
export class AdminMediasComponent {
  constructor(
    private modalService: ModalService,
    private formModalService: FormModalService,
    private http: HttpClient
  ) {}

  /**
   * DECLARATIONS
   */
  media: MediaType = {
    id: '',
    fileName: '',
    url: '',
    title: '',
    description: '',
    altText: '',
    file: undefined,
    height: undefined,
    width: undefined,
  };

  medias: MediaType[] = [];

  // mediasToSelect :CategoryToSelectType[] = [];
  // brandsToSelect :BrandToSelectType[] = [];
  errorMessage$ = this.formModalService.errorMessage$;

  /**
   * ON INIT
   */
  ngOnInit() {
    // this.fetchProducts();
    // this.fetchCategories();
    // this.fetchBrands();
    this.fetchMedias();
  }

  /**
   * FONCTIONS
   */

  fetchMedias() {
    this.http
      .get<any[]>(`${environment.apiUrl}/medias`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.medias = data.sort((a, b) => a.title.localeCompare(b.title));
          console.log(data);
        },
        error: (err) => {
          console.error('Erreur lors du fetch des catégories', err);
        },
      });
  }

  // fetchProducts() {
  //   this.http
  //     .get<any[]>(`${environment.apiUrl}/products`, { withCredentials: true })
  //     .subscribe({
  //       next: (data) => {
  //         this.products = data.sort((a, b) => a.name.localeCompare(b.name));
  //         console.log(data);
  //       },
  //       error: (err) => {
  //         console.error('Erreur lors du fetch des catégories', err);
  //       },
  //     });
  // }

  // fetchCategories() {
  //   this.http
  //     .get<any[]>(`${environment.apiUrl}/categories`, { withCredentials: true })
  //     .subscribe({
  //       next: (data) => {
  //         const rawCategories = data.sort((a, b) =>
  //           a.name.localeCompare(b.name)
  //         );

  //         this.categoriesToSelect = rawCategories.map((c) => ({
  //           label: c.name,
  //           value: c.id,
  //         }));
  //         console.log(data);
  //       },
  //       error: (err) => {
  //         console.error('Erreur lors du fetch des catégories', err);
  //       },
  //     });
  // }

  // fetchBrands() {
  //   this.http
  //     .get<any[]>(`${environment.apiUrl}/brands`, { withCredentials: true })
  //     .subscribe({
  //       next: (data) => {
  //         const rawBrands = data.sort((a, b) =>
  //           a.name.localeCompare(b.name)
  //         );

  //         this.brandsToSelect = rawBrands.map((c) => ({
  //           label: c.name,
  //           value: c.id,
  //         }));
  //         console.log(data);
  //       },
  //       error: (err) => {
  //         console.error('Erreur lors du fetch des marques', err);
  //       },
  //     });
  // }

  getOptimizedImageUrl(
    url: string | undefined,
    width: number,
    height: number
  ): string {
    const transformation = `w_${width},h_${height},c_fill`;
    if (url) {
      return url.replace('/upload/', `/upload/${transformation}/`);
    } else {
      return '';
    }
  }

  addMediaAction(datas: MediaType) {
    // this.http
    //   .post<any[]>(`${environment.apiUrl}/products`, datas, {
    //     withCredentials: true,
    //   })
    //   .subscribe({
    //     next: (data) => {
    //       return data;
    //     },
    //     error: (err) => {
    //       console.error('Erreur lors du fetch des produits', err);
    //       const msg =
    //         err?.error?.message || 'Une erreur est survenue lors de l’ajout.';
    //       this.formModalService.setError(msg);
    //     },
    //   });

    // return this.http.post<any>(`${environment.apiUrl}/medias`, datas, {
    //   withCredentials: true,
    // });
      const formData = new FormData();

      if (datas.file) {
        formData.append('file', datas.file);
      }

      // Ajout des autres champs si définis
      if (datas.title) formData.append('title', datas.title);
      if (datas.description) formData.append('description', datas.description);
      if (datas.altText) formData.append('altText', datas.altText);
      if (datas.fileName) formData.append('fileName', datas.fileName);
      if (datas.height !== undefined) formData.append('height', String(datas.height));
      if (datas.width !== undefined) formData.append('width', String(datas.width));

      return this.http.post<any>(`${environment.apiUrl}/medias`, formData, {
        withCredentials: true,
      });

  }

  addMedia() {
    // this.modalService.setDynamicComponent(LoginComponent);
    this.modalService.open('Ajouter un média');
    this.formModalService.openFormModal({
      title: 'Ajouter un média',
      fields: [
        { label: 'Nom', name: 'title', type: 'text', required: true },
        // { label: 'Image URL', name: 'image', type: 'text' },
        { label: 'Description', name: 'description', type: 'textarea' },
        {
          label: 'Image',
          name: 'file',
          type: 'file',
          required: true,
        }
        // {
        //   label: 'Catégorie',
        //   name: 'category',
        //   type: 'select',
        //   required: true,
        //   options: this.categoriesToSelect,
        // },
        // {
        //   label: 'Marques',
        //   name: 'brand',
        //   type: 'select',
        //   required: true,
        //   options: this.brandsToSelect,
        // },
        // variations?: ProductVariationsType[];
      ],
      onSubmit: async (data) => {
        console.log('Produit reçu :', data);
        // const response = await this.addProductAction(data);
        // console.log('response', response);
        // this.fetchProducts();
        // this.fetchCategories();
        // this.fetchBrands();
        // this.modalService.close();
        // this.formModalService.close();
        this.addMediaAction(data).subscribe({
          next: (res) => {
            console.log('Produit ajouté :', res);
            // this.fetchProducts();
            // this.fetchCategories();
            // this.fetchBrands();
            this.fetchMedias();
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

  editMedia(media: MediaType) {
    this.modalService.open('Modifier un produit');
    this.formModalService.openFormModal({
      title: 'Modifier un produit',
      fields: [
        { label: 'Nom', name: 'title', type: 'text', required: true,value: media.title, },
        // { label: 'Image URL', name: 'image', type: 'text' },
        { label: 'Description', name: 'description', type: 'textarea',value: media.description, },
        {
          label: 'Image',
          name: 'file',
          type: 'file',
          required: true,
          value: media.url,
        }
      ],
      onSubmit: (data) => {
        const updated = { ...media, ...data };
        this.http
          .patch(`${environment.apiUrl}/medias/${media.id}`, updated, {
            withCredentials: true,
          })
          .subscribe({
            next: () => {
              // this.fetchProducts();
              // this.fetchCategories();
              // this.fetchBrands();
              this.fetchMedias();
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

  deleteMedia(media: MediaType) {
    if (confirm(`Supprimer le media "${media.title}" ?`)) {
      this.http
        .delete(`${environment.apiUrl}/medias/${media.id}`, {
          withCredentials: true,
        })
        .subscribe({
          next: () => this.fetchMedias(),
          error: (err) => {
            console.error('Erreur suppression', err);
          },
        });
    }
  }
}
