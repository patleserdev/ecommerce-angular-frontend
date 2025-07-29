import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { FormModalService } from '../../../services/form-modal.service';
import { HttpClient } from '@angular/common/http';
import { BrandType } from '../../../models/brands.js';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { MediaLinkService } from '../../../services/media-link.service';
import { BrandsService } from '../../../services/brands.service.js';
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
    private http: HttpClient,
    private mediaLinkService : MediaLinkService,
    private brandsService : BrandsService
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
    // this.http
    //   .get<any[]>(`${environment.apiUrl}/brands`, { withCredentials: true })
    this.brandsService.getBrands()
      .subscribe({
        next: (data) => {
          this.brands = data.sort((a, b) => a.name.localeCompare(b.name));
          // console.log('brands',data);
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
    // return this.http.post<any>(`${environment.apiUrl}/brands`, datas, {
    //   withCredentials: true,
    // });
    return this.brandsService.addBrand(datas)
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
        // this.http
        //   .patch(`${environment.apiUrl}/brands/${brand.id}`, updated, {
        //     withCredentials: true,
        //   })
        if(brand.id)
        this.brandsService.updateBrand(brand.id,updated)
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
    if(brand.id)
    if (confirm(`Supprimer la catégorie "${brand.name}" ?`)) {
      // this.http
      //   .delete(`${environment.apiUrl}/brands/${brand.id}`, { withCredentials: true })
      this.brandsService.deleteBrand(brand.id)
        .subscribe({
          next: () => this.fetchBrands(),
          error: (err) => {
            console.error('Erreur suppression', err);
          },
        });
    }
  }

  openMediaSelector(brand: BrandType) {
    this.modalService.open('Sélectionner un média pour le produit ' + brand.name);

    this.formModalService.openFormModal({
      title: 'Sélectionner un média pour ' + brand.name,
      fields: [
        {
          label: 'Médias liés',
          name: 'mediaLinks',
          type: 'mediaSelector',
          value: brand.medias ?? [],
        },
      ],
      onSubmit: (data) => {
        this.modalService.setLoading(true); // ⏳ spinner ON


          const currentMedias = brand.medias ?? [];
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
              linkedType: 'brand',
              linkedId: brand.id,
              role: 'gallery' as const,
            };

            this.mediaLinkService.createMediaLink(link).subscribe({
              next: (res) => {
                console.log('Lien créé :', res);
                this.fetchBrands();
                this.modalService.setLoading(false); // ✅ spinner OFF

              },
              error: (err) => {
                console.error('Erreur création lien :', err)
                this.modalService.setLoading(false); // ✅ spinner OFF
              }
            });
          }

          // Suppression des anciens liens
          for (const mediaId of removedMediaIds) {
            if(brand.id)
            this.mediaLinkService
              .deleteMediaLinkByLinkedIdAndMediaId(brand.id, mediaId)
              .subscribe({
                next: () => {
                  console.log(`Lien supprimé : media ${mediaId} de product ${brand.id}`);
                  this.fetchBrands();
                  this.modalService.setLoading(false); // ✅ spinner OFF

                },
                error: (err) => {
                  console.error('Erreur suppression lien :', err)
                  this.modalService.setLoading(false); // ✅ spinner OFF
                }
              });
          }

          this.modalService.close();
          this.formModalService.close();
      },
    });
  }

}
