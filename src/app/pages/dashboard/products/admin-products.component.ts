import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { FormModalService } from '../../../services/form-modal.service';
import { HttpClient } from '@angular/common/http';
import { ProductType } from '../../../models/product';
import { environment } from '../../../../environments/environment';
import {
  CategoryToSelectType,
  CategoryType,
} from '../../../models/categorie.js';
import { BrandToSelectType } from '../../../models/brands';

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

  categoriesToSelect: CategoryToSelectType[] = [];
  brandsToSelect: BrandToSelectType[] = [];
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
          const rawBrands = data.sort((a, b) => a.name.localeCompare(b.name));

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
    return this.http.post<any>(`${environment.apiUrl}/products`, datas, {
      withCredentials: true,
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
        {
          label: 'Variations',
          name: 'variations',
          type: 'array',
          fields: [
            { label: 'Genre', name: 'gender', type: 'text', required: true },
            { label: 'Taille', name: 'size', type: 'text', required: true },
            { label: 'Couleur', name: 'color', type: 'color', required: true },
            { label: 'Stock', name: 'stock', type: 'number', required: true },
          ],

        }
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
        const productToSend = {
          ...data,
          variations: data.variations || [],
        };

        this.addProductAction(productToSend).subscribe({
          next: (res) => {
            console.log('Produit ajouté :', res);
            this.fetchProducts();
            this.fetchCategories();
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
        // { label: 'Image URL', name: 'image', type: 'text' },
        {
          label: 'Description',
          name: 'description',
          type: 'textarea',
          value: product.description,
        },
        {
          label: 'Prix',
          name: 'price',
          type: 'number',
          required: true,
          value: product.price,
        },
        {
          label: 'SKU',
          name: 'sku',
          type: 'string',
          required: true,
          value: product.sku,
        },
        {
          label: 'Catégorie',
          name: 'category',
          type: 'select',
          required: true,
          options: this.categoriesToSelect,
          value: product.category?.id,
        },
        {
          label: 'Marques',
          name: 'brand',
          type: 'select',
          required: true,
          options: this.brandsToSelect,
          value: product.brand?.id,
        },
        {
          label: 'Variations',
          name: 'variations',
          type: 'array',
          fields: [
            { label: 'Genre', name: 'gender', type: 'text', required: true },
            { label: 'Taille', name: 'size', type: 'text', required: true },
            { label: 'Couleur', name: 'color', type: 'color', required: true },
            { label: 'Stock', name: 'stock', type: 'number', required: true },
          ],
          value: product.variations,
        }
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
              this.fetchCategories();
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

  openMediaSelector(product: ProductType) {
    this.modalService.open('Sélectionner un média pour ' + product.name,);
    this.formModalService.openFormModal({
      title: 'Sélectionner un média pour ' + product.name,
      fields: [
        // Exemple: un champ pour sélectionner le média, adapte selon ton mediaSelector
        {
          label: 'Médias liés',
          name: 'mediaLinks',
          type: 'mediaSelector', // type personnalisé à gérer dans ton formModal
          value: [],              // la valeur initiale si besoin
        }
      ],
      onSubmit: (data) => {
        // Ici tu récupères les médias sélectionnés et fais ce que tu veux
        console.log('Médias sélectionnés :', data);

        // Appel service pour créer le lien média - produit
        // Exemple:
        // this.mediaLinkService.linkMediaToProduct(product.id, data.mediaLinks).subscribe(...);

        this.modalService.close();
        this.formModalService.close();
      },
    });
  }

}
