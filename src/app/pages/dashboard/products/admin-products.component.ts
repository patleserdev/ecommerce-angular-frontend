import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../shared/modal.service';
import { FormModalService } from '../../../shared/form-modal.service';
import { HttpClient } from '@angular/common/http';
import { ProductType } from '../../../models/product';
import { environment } from '../../../../environments/environment';
import { CategoryToSelectType, CategoryType } from '../../../models/categorie.js';
import { BrandToSelectType } from '../../../models/brands.js';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent {
  constructor(
    private modalService: ModalService,
    private formModalService: FormModalService,
    private http: HttpClient
  ) {}

  /**
   * DECLARATIONS
   */
  product: ProductType = {
    id: 0,
    description: '',
    name: '',
    slug: '',
    price: 0,
    sku: '',
    category: undefined,
    brand: undefined,
    variations: [],
  };

  products: ProductType[] = [];

  categoriesToSelect :CategoryToSelectType[] = [];
  brandsToSelect :BrandToSelectType[] = [];
  errorMessage$ = this.formModalService.errorMessage$;

  /**
   * ON INIT
   */
  ngOnInit() {
    this.fetchProducts();
    this.fetchCategories();
    this.fetchBrands();
  }

  /**
   * FONCTIONS
   */

  fetchProducts() {
    this.http
      .get<any[]>(`${environment.apiUrl}/products`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.products = data.sort((a, b) => a.name.localeCompare(b.name));
          console.log(data);
        },
        error: (err) => {
          console.error('Erreur lors du fetch des catégories', err);
        },
      });
  }

  fetchCategories() {
    this.http
      .get<any[]>(`${environment.apiUrl}/categories`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          const rawCategories = data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          this.categoriesToSelect = rawCategories.map((c) => ({
            label: c.name,
            value: c.id,
          }));
          console.log(data);
        },
        error: (err) => {
          console.error('Erreur lors du fetch des catégories', err);
        },
      });
  }

  fetchBrands() {
    this.http
      .get<any[]>(`${environment.apiUrl}/brands`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          const rawBrands = data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          this.brandsToSelect = rawBrands.map((c) => ({
            label: c.name,
            value: c.id,
          }));
          console.log(data);
        },
        error: (err) => {
          console.error('Erreur lors du fetch des marques', err);
        },
      });
  }

  addProductAction(datas: ProductType) {
    this.http
      .post<any[]>(`${environment.apiUrl}/products`, datas, {
        withCredentials: true,
      })
      .subscribe({
        next: (data) => {
          return data;
        },
        error: (err) => {
          console.error('Erreur lors du fetch des produits', err);
          const msg =
            err?.error?.message || 'Une erreur est survenue lors de l’ajout.';
          this.formModalService.setError(msg);
        },
      });
  }

  addProduct() {
    // this.modalService.setDynamicComponent(LoginComponent);
    this.modalService.open('Ajouter un produit');
    this.formModalService.openFormModal({
      title: 'Ajouter un produit',
      fields: [
        { label: 'Nom', name: 'name', type: 'text', required: true },
        // { label: 'Image URL', name: 'image', type: 'text' },
        { label: 'Description', name: 'description', type: 'textarea' },
        { label: 'Prix', name: 'price', type: 'number', required: true },
        { label: 'SKU', name: 'sku', type: 'string', required: true },
        {
          label: 'Catégorie',
          name: 'category',
          type: 'select',
          required: true,
          options: this.categoriesToSelect,
        },
        {
          label: 'Marques',
          name: 'brand',
          type: 'select',
          required: true,
          options: this.brandsToSelect,
        },
        // variations?: ProductVariationsType[];
      ],
      onSubmit: async (data) => {
        console.log('Catégorie reçue :', data);
        const response = await this.addProductAction(data);
        console.log('response', response);
        this.fetchProducts();
        this.modalService.close();
        this.formModalService.close();
      },
    });
  }

  editProduct(product: ProductType) {
    this.modalService.open('Modifier un produit');
    this.formModalService.openFormModal({
      title: 'Modifier un produit',
      fields: [
        {
          label: 'Nom',
          name: 'name',
          type: 'text',
          required: true,
          value: product.name,
        },
      ],
      onSubmit: (data) => {
        const updated = { ...product, ...data };
        this.http
          .patch(`${environment.apiUrl}/products/${product.id}`, updated, {
            withCredentials: true,
          })
          .subscribe({
            next: () => {
              this.fetchProducts();
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

  deleteProduct(product: ProductType) {
    if (confirm(`Supprimer le produit "${product.name}" ?`)) {
      this.http
        .delete(`${environment.apiUrl}/products/${product.id}`, {
          withCredentials: true,
        })
        .subscribe({
          next: () => this.fetchProducts(),
          error: (err) => {
            console.error('Erreur suppression', err);
          },
        });
    }
  }
}
