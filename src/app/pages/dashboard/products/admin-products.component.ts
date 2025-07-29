import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { FormModalService } from '../../../services/form-modal.service';
import { HttpClient } from '@angular/common/http';
import { ProductType } from '../../../models/product';
import { environment } from '../../../../environments/environment';
import { CategoryToSelectType } from '../../../models/categorie.js';
import { BrandToSelectType } from '../../../models/brands';
import { ProductsService } from '../../../services/products.service';
import { CategoriesService } from '../../../services/categories.service';
import { BrandsService } from '../../../services/brands.service';
import { MediaLinkService } from '../../../services/media-link.service.js';
import { FormModalComponent } from '../../../shared/form-modal/form-modal.component.js';

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
    private http: HttpClient,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private brandsService: BrandsService,
    private mediaLinkService: MediaLinkService
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
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data.sort((a, b) => a.name.localeCompare(b.name));
        // console.log(data);
      },
      error: (err) => {
        console.error('Erreur lors du fetch des produits', err);
      },
    });
  }

  fetchCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        const rawCategories = data.sort((a, b) => a.name.localeCompare(b.name));

        this.categoriesToSelect = rawCategories.map((c) => ({
          label: c.name,
          value: c.id,
        }));
        // console.log(data);
      },
      error: (err) => {
        console.error('Erreur lors du fetch des catégories', err);
      },
    });
  }

  fetchBrands() {
    this.brandsService.getBrandsToSelect().subscribe({
      next: (data) => {
        const rawBrands = data.sort((a, b) => a.name.localeCompare(b.name));

        this.brandsToSelect = rawBrands.map((c) => ({
          label: c.name,
          value: c.id,
        }));
        // console.log(data);
      },
      error: (err) => {
        console.error('Erreur lors du fetch des marques', err);
      },
    });
  }

  addProductAction(datas: ProductType) {
    // return this.http.post<any>(`${environment.apiUrl}/products`, datas, {
    //   withCredentials: true,
    // });
    return this.productsService.addProduct(datas);
  }

  addProduct() {
    this.modalService.openWithComponent(
      'Ajouter un produit',
      FormModalComponent,
      {
        title: 'Ajouter un produit',
        fields: [
          { label: 'Nom', name: 'name', type: 'text', required: true },
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
              {
                label: 'Couleur',
                name: 'color',
                type: 'color',
                required: true,
              },
              { label: 'Stock', name: 'stock', type: 'number', required: true },
            ],
          },
        ],
        onSubmit: async (data: any) => {
          console.log('Produit reçu :', data);
          const productToSend = {
            ...data,
            variations: data.variations || [],
          };
          this.modalService.setLoading(true);
          this.addProductAction(productToSend).subscribe({
            next: (res) => {
              console.log('Produit ajouté :', res);
              this.fetchProducts();
              this.fetchCategories();
              this.fetchBrands();
              this.modalService.close();
              this.formModalService.close();
              this.modalService.setLoading(false);
            },
            error: (err) => {
              const msg = err?.error?.message || 'Erreur lors de l’ajout.';
              this.formModalService.setError(msg);
              this.modalService.setLoading(false);
            },
          });
        },
      }
    );

    // this.modalService.open('Ajouter un produit');
    // this.formModalService.openFormModal({
    //   title: 'Ajouter un produit',
    //   fields: [
    //     { label: 'Nom', name: 'name', type: 'text', required: true },
    //     { label: 'Description', name: 'description', type: 'textarea' },
    //     { label: 'Prix', name: 'price', type: 'number', required: true },
    //     { label: 'SKU', name: 'sku', type: 'string', required: true },
    //     {
    //       label: 'Catégorie',
    //       name: 'category',
    //       type: 'select',
    //       required: true,
    //       options: this.categoriesToSelect,
    //     },
    //     {
    //       label: 'Marques',
    //       name: 'brand',
    //       type: 'select',
    //       required: true,
    //       options: this.brandsToSelect,
    //     },
    //     {
    //       label: 'Variations',
    //       name: 'variations',
    //       type: 'array',
    //       fields: [
    //         { label: 'Genre', name: 'gender', type: 'text', required: true },
    //         { label: 'Taille', name: 'size', type: 'text', required: true },
    //         { label: 'Couleur', name: 'color', type: 'color', required: true },
    //         { label: 'Stock', name: 'stock', type: 'number', required: true },
    //       ],
    //     },
    //   ],
    //   onSubmit: async (data) => {
    //     console.log('Produit reçu :', data);
    //     const productToSend = {
    //       ...data,
    //       variations: data.variations || [],
    //     };
    //     this.modalService.setLoading(true)
    //     this.addProductAction(productToSend).subscribe({
    //       next: (res) => {
    //         console.log('Produit ajouté :', res);
    //         this.fetchProducts();
    //         this.fetchCategories();
    //         this.fetchBrands();
    //         this.modalService.close();
    //         this.formModalService.close();
    //         this.modalService.setLoading(false)
    //       },
    //       error: (err) => {
    //         const msg = err?.error?.message || 'Erreur lors de l’ajout.';
    //         this.formModalService.setError(msg);
    //         this.modalService.setLoading(false)
    //       },
    //     });
    //   },
    // });
  }

  editProduct(product: ProductType) {
    this.modalService.openWithComponent(
      'Modifier un produit',
      FormModalComponent,
      {
        title: 'Modifier un produit',
        fields: [
          {
            label: 'Nom',
            name: 'name',
            type: 'text',
            required: true,
            value: product.name,
          },
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
              {
                label: 'Couleur',
                name: 'color',
                type: 'color',
                required: true,
              },
              { label: 'Stock', name: 'stock', type: 'number', required: true },
            ],
            value: product.variations,
          },
        ],
        onSubmit: (data: any) => {
          const updated = { ...product, ...data };
          // this.http
          //   .patch(`${environment.apiUrl}/products/${product.id}`, updated, {
          //     withCredentials: true,
          //   })
          if (product.id)
            this.productsService.updateProduct(product.id, updated).subscribe({
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
      }
    );

    // this.modalService.open('Modifier un produit');
    // this.formModalService.openFormModal({
    //   title: 'Modifier un produit',
    //   fields: [
    //     {
    //       label: 'Nom',
    //       name: 'name',
    //       type: 'text',
    //       required: true,
    //       value: product.name,
    //     },
    //     {
    //       label: 'Description',
    //       name: 'description',
    //       type: 'textarea',
    //       value: product.description,
    //     },
    //     {
    //       label: 'Prix',
    //       name: 'price',
    //       type: 'number',
    //       required: true,
    //       value: product.price,
    //     },
    //     {
    //       label: 'SKU',
    //       name: 'sku',
    //       type: 'string',
    //       required: true,
    //       value: product.sku,
    //     },
    //     {
    //       label: 'Catégorie',
    //       name: 'category',
    //       type: 'select',
    //       required: true,
    //       options: this.categoriesToSelect,
    //       value: product.category?.id,
    //     },
    //     {
    //       label: 'Marques',
    //       name: 'brand',
    //       type: 'select',
    //       required: true,
    //       options: this.brandsToSelect,
    //       value: product.brand?.id,
    //     },
    //     {
    //       label: 'Variations',
    //       name: 'variations',
    //       type: 'array',
    //       fields: [
    //         { label: 'Genre', name: 'gender', type: 'text', required: true },
    //         { label: 'Taille', name: 'size', type: 'text', required: true },
    //         { label: 'Couleur', name: 'color', type: 'color', required: true },
    //         { label: 'Stock', name: 'stock', type: 'number', required: true },
    //       ],
    //       value: product.variations,
    //     },
    //   ],
    //   onSubmit: (data) => {
    //     const updated = { ...product, ...data };
    //     // this.http
    //     //   .patch(`${environment.apiUrl}/products/${product.id}`, updated, {
    //     //     withCredentials: true,
    //     //   })
    //     if(product.id)
    //     this.productsService.updateProduct(product.id,updated)
    //       .subscribe({
    //         next: () => {
    //           this.fetchProducts();
    //           this.fetchCategories();
    //           this.fetchBrands();
    //           this.modalService.close();
    //           this.formModalService.close();
    //         },
    //         error: (err) => {
    //           const msg =
    //             err?.error?.message || 'Erreur lors de la mise à jour.';
    //           this.formModalService.setError(msg);
    //         },
    //       });
    //   },
    // });
  }

  deleteProduct(product: ProductType) {
    if (product.id)
      if (confirm(`Supprimer le produit "${product.name}" ?`)) {
        // this.http
        //   .delete(`${environment.apiUrl}/products/${product.id}`, {
        //     withCredentials: true,
        //   })

        this.productsService
          .deleteProduct(product.id)

          .subscribe({
            next: () => this.fetchProducts(),
            error: (err) => {
              console.error('Erreur suppression', err);
            },
          });
      }
  }

  openMediaSelector(product: ProductType) {
    this.modalService.openWithComponent(
      'Sélectionner un média pour le produit ' + product.name,
      FormModalComponent,
      {
        title: 'Sélectionner un média pour ' + product.name,
        fields: [
          {
            label: 'Médias liés',
            name: 'mediaLinks',
            type: 'mediaSelector',
            value: product.medias ?? [],
          },
        ],
        onSubmit: (data: any) => {
          this.modalService.setLoading(true); // ⏳ spinner ON

          const currentMedias = product.medias ?? [];
          const selectedMediaIds = new Set<string>(data.mediaLinks);

          const existingMediaIds = new Set<string>(
            currentMedias.map((m) => m.id)
          );

          // ✅ Médias à ajouter
          const newMediaIds = data.mediaLinks.filter(
            (id: string) => !existingMediaIds.has(id)
          );

          // ❌ Médias à supprimer
          const removedMediaIds = currentMedias
            .filter((m) => !selectedMediaIds.has(m.id))
            .map((m) => m.id);

          // Création des nouveaux liens
          for (const id of newMediaIds) {
            const link = {
              mediaId: id,
              linkedType: 'product',
              linkedId: product.id,
              role: 'gallery' as const,
            };

            this.mediaLinkService.createMediaLink(link).subscribe({
              next: (res) => {
                console.log('Lien créé :', res);
                this.fetchProducts();
                this.modalService.setLoading(false); // ✅ spinner OFF
              },
              error: (err) => {
                console.error('Erreur création lien :', err);
                this.modalService.setLoading(false); // ✅ spinner OFF
              },
            });
          }

          // Suppression des anciens liens
          for (const mediaId of removedMediaIds) {
            if (product.id)
              this.mediaLinkService
                .deleteMediaLinkByLinkedIdAndMediaId(product.id, mediaId)
                .subscribe({
                  next: () => {
                    console.log(
                      `Lien supprimé : media ${mediaId} de product ${product.id}`
                    );
                    this.fetchProducts();
                    this.modalService.setLoading(false); // ✅ spinner OFF
                  },
                  error: (err) => {
                    console.error('Erreur suppression lien :', err);
                    this.modalService.setLoading(false); // ✅ spinner OFF
                  },
                });
          }

          this.modalService.close();
          this.formModalService.close();
        },
      }
    );

    // this.modalService.open('Sélectionner un média pour le produit ' + product.name);

    // this.formModalService.openFormModal({
    //   title: 'Sélectionner un média pour ' + product.name,
    //   fields: [
    //     {
    //       label: 'Médias liés',
    //       name: 'mediaLinks',
    //       type: 'mediaSelector',
    //       value: product.medias ?? [],
    //     },
    //   ],
    //   onSubmit: (data) => {
    //     this.modalService.setLoading(true); // ⏳ spinner ON

    //       const currentMedias = product.medias ?? [];
    //       const selectedMediaIds = new Set<string>(data.mediaLinks);

    //       const existingMediaIds = new Set<string>(
    //         currentMedias.map((m) => m.id)
    //       );

    //       // ✅ Médias à ajouter
    //       const newMediaIds = data.mediaLinks.filter(
    //         (id: string) => !existingMediaIds.has(id)
    //       );

    //       // ❌ Médias à supprimer
    //       const removedMediaIds = currentMedias
    //         .filter((m) => !selectedMediaIds.has(m.id))
    //         .map((m) => m.id);

    //       // Création des nouveaux liens
    //       for (const id of newMediaIds) {
    //         const link = {
    //           mediaId: id,
    //           linkedType: 'product',
    //           linkedId: product.id,
    //           role: 'gallery' as const,
    //         };

    //         this.mediaLinkService.createMediaLink(link).subscribe({
    //           next: (res) => {
    //             console.log('Lien créé :', res);
    //             this.fetchProducts();
    //             this.modalService.setLoading(false); // ✅ spinner OFF

    //           },
    //           error: (err) => {
    //             console.error('Erreur création lien :', err)
    //             this.modalService.setLoading(false); // ✅ spinner OFF
    //           }
    //         });
    //       }

    //       // Suppression des anciens liens
    //       for (const mediaId of removedMediaIds) {
    //         if(product.id)
    //         this.mediaLinkService
    //           .deleteMediaLinkByLinkedIdAndMediaId(product.id, mediaId)
    //           .subscribe({
    //             next: () => {
    //               console.log(`Lien supprimé : media ${mediaId} de product ${product.id}`);
    //               this.fetchProducts();
    //               this.modalService.setLoading(false); // ✅ spinner OFF

    //             },
    //             error: (err) => {
    //               console.error('Erreur suppression lien :', err)
    //               this.modalService.setLoading(false); // ✅ spinner OFF
    //             }
    //           });
    //       }

    //       this.modalService.close();
    //       this.formModalService.close();

    //   },
    // });
  }
}
