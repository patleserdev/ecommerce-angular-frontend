import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { FormModalService } from '../../../services/form-modal.service';
import { HttpClient } from '@angular/common/http';
import { ProductType } from '../../../models/product';
import { CategoryToSelectType } from '../../../models/categorie';
import { BrandToSelectType } from '../../../models/brands';
import { ProductsService } from '../../../services/products.service';
import { CategoriesService } from '../../../services/categories.service';
import { BrandsService } from '../../../services/brands.service';
import { MediaLinkService } from '../../../services/media-link.service';
import { FormModalComponent } from '../../../shared/form-modal/form-modal.component';
import { MediaType } from '../../../models/medias';
import { firstValueFrom } from 'rxjs';

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
        console.log("récupération des produits ",data);
      },
      error: (err) => {
        console.error('Erreur lors du fetch des produits', err);
      },
    });
  }

  fetchCategories() {
    this.categoriesService.getCategoriesToAdministrate().subscribe({
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
            value: product.medias ?? [], // doit contenir id + position
            returnFullObject: true, // ✅ ajout

          },
        ],
        onSubmit: async (data: any) => {
          this.modalService.setLoading(true);
          // console.log('en sortie du media selector', data);

          const currentMedias = product.medias ?? [];
          const selectedMedia: MediaType[] = data.mediaLinks;

          const currentMediaMap = new Map(
            currentMedias.map((m) => [m.id, m.position ?? 0])
          );

          const selectedIds = new Set(selectedMedia.map((m) => m.id));
          const currentIds = new Set(currentMedias.map((m) => m.id));

          // Médias supprimés
          const removedMediaIds = currentMedias
            .filter((m) => !selectedIds.has(m.id))
            .map((m) => m.id);

          for (const [index, media] of selectedMedia.entries()) {
            const mediaId = media.id;
            const newPosition = index;

            if (!mediaId) continue;

            if (!currentIds.has(mediaId)) {
              // Création d'un nouveau lien
              const link = {
                mediaId,
                linkedType: 'product',
                linkedId: product.id,
                role: 'gallery' as const,
                position: newPosition,
              };

              try {
                await firstValueFrom(this.mediaLinkService.createMediaLink(link));
                console.log('Lien créé :', mediaId);
              } catch (err) {
                console.error('Erreur création lien :', err);
              }
            } else {
              const oldPosition = currentMediaMap.get(mediaId);
              if (oldPosition !== newPosition) {
                try {
                  await firstValueFrom(
                    this.mediaLinkService.updateMediaLink({
                      mediaId,
                      linkedId: product.id,
                      linkedType: 'product',
                      position: newPosition,
                    })
                  );
                  console.log(`Position mise à jour : media ${mediaId} → ${newPosition}`);
                } catch (err) {
                  console.error(`Erreur mise à jour position media ${mediaId}`, err);
                }
              }
            }
          }

          for (const mediaId of removedMediaIds) {
            if(product.id)
            {
              try {
                await firstValueFrom(
                  this.mediaLinkService.deleteMediaLinkByLinkedIdAndMediaId(product.id, mediaId)
                );
                console.log(`Lien supprimé : media ${mediaId} de product ${product.id}`);
              } catch (err) {
                console.error(`Erreur suppression lien media ${mediaId}`, err);
              }
            }

          }

          // ✅ Maintenant que tout est terminé, tu peux refetch
          await this.fetchProducts();

          this.modalService.setLoading(false);
          this.modalService.close();
          this.formModalService.close();
        }
      }
    );
  }

}
