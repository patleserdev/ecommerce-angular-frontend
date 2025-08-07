import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { FormModalService } from '../../../services/form-modal.service';
import { CategoryType } from '../../../models/categorie';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { MediaLinkService } from '../../../services/media-link.service.js';
import { CategoriesService } from '../../../services/categories.service.js';
import { FormModalComponent } from '../../../shared/form-modal/form-modal.component.js';
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
    private http: HttpClient,
    private mediaLinkService : MediaLinkService,
    private categoriesService: CategoriesService
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
    // this.http.get<any[]>(`${environment.apiUrl}/categories`, { withCredentials: true })
    this.categoriesService.getCategories()
      .subscribe({
        next: (data) => {
          this.categories = data.sort((a, b) => a.name.localeCompare(b.name));
          console.log("categories for admin",data);
        },
        error: (err) => {
          console.error('Erreur lors du fetch des catégories', err);
        },
      });
  }

  addCategorieAction(datas: CategoryType) {
    // this.http
    //   .post<any[]>(`${environment.apiUrl}/categories`, datas, { withCredentials: true })
    //   .subscribe({
    //     next: (data) => {
    //       return data;
    //     },
    //     error: (err) => {
    //       console.error('Erreur lors du fetch des catégories', err);
    //       const msg =
    //         err?.error?.message || 'Une erreur est survenue lors de l’ajout.';
    //       this.formModalService.setError(msg);
    //     },
    //   });
    // return this.http.post<any>(`${environment.apiUrl}/categories`, datas, {
    //   withCredentials: true,
    // });
    return this.categoriesService.addCategory(datas)
  }

  addCategory() {
    // this.modalService.setDynamicComponent(LoginComponent);
    this.modalService.openWithComponent('Ajouter une catégorie',FormModalComponent,{
      title: 'Ajouter une catégorie',
      fields: [
        { label: 'Nom', name: 'name', type: 'text', required: true },
        // { label: 'Image URL', name: 'image', type: 'text' },
        // { label: 'Description', name: 'description', type: 'textarea' },
      ],
      onSubmit: async (data:any) => {
        console.log('Catégorie reçue :', data);
        // const response = await this.addCategorieAction(data);
        // console.log('response', response);
        // this.fetchCategories();
        // this.modalService.close();
        // this.formModalService.close();
        this.addCategorieAction(data).subscribe({
          next: (res) => {
            this.fetchCategories();
            this.modalService.close();
            this.formModalService.close();
          },
          error: (err) => {
            const msg = err?.error?.message || 'Erreur lors de l’ajout.';
            this.formModalService.setError(msg);
          },
        });
      },
    })

    // this.modalService.open('Ajouter une catégorie');
    // this.formModalService.openFormModal({
    //   title: 'Ajouter une catégorie',
    //   fields: [
    //     { label: 'Nom', name: 'name', type: 'text', required: true },
    //     // { label: 'Image URL', name: 'image', type: 'text' },
    //     // { label: 'Description', name: 'description', type: 'textarea' },
    //   ],
    //   onSubmit: async (data) => {
    //     console.log('Catégorie reçue :', data);
    //     // const response = await this.addCategorieAction(data);
    //     // console.log('response', response);
    //     // this.fetchCategories();
    //     // this.modalService.close();
    //     // this.formModalService.close();
    //     this.addCategorieAction(data).subscribe({
    //       next: (res) => {
    //         this.fetchCategories();
    //         this.modalService.close();
    //         this.formModalService.close();
    //       },
    //       error: (err) => {
    //         const msg = err?.error?.message || 'Erreur lors de l’ajout.';
    //         this.formModalService.setError(msg);
    //       },
    //     });
    //   },
    // });
  }

  editCategory(cat: CategoryType) {
    this.modalService.openWithComponent('Modifier une catégorie',FormModalComponent,{
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
      onSubmit: (data:any) => {
        const updated = { ...cat, ...data };
        // this.http
        //   .patch(`${environment.apiUrl}/categories/${cat.id}`, updated, {
        //     withCredentials: true,
        //   })
        this.categoriesService.updateCategory(cat.id,updated)
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
    })

    // this.modalService.open('Modifier une catégorie');
    // this.formModalService.openFormModal({
    //   title: 'Modifier une catégorie',
    //   fields: [
    //     {
    //       label: 'Nom',
    //       name: 'name',
    //       type: 'text',
    //       required: true,
    //       value: cat.name,
    //     },
    //   ],
    //   onSubmit: (data) => {
    //     const updated = { ...cat, ...data };
    //     // this.http
    //     //   .patch(`${environment.apiUrl}/categories/${cat.id}`, updated, {
    //     //     withCredentials: true,
    //     //   })
    //     this.categoriesService.updateCategory(cat.id,updated)
    //       .subscribe({
    //         next: () => {
    //           this.fetchCategories();
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

  deleteCategory(cat: CategoryType) {
    if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
      // this.http
      //   .delete(`${environment.apiUrl}/categories/${cat.id}`, { withCredentials: true })
      this.categoriesService.deleteCategory(cat.id)
        .subscribe({
          next: () => this.fetchCategories(),
          error: (err) => {
            console.error('Erreur suppression', err);
          },
        });
    }
  }

  openMediaSelector(category: CategoryType) {
    this.modalService.openWithComponent('Sélectionner un média pour la catégorie ' + category.name,FormModalComponent,{
      title: 'Sélectionner un média pour ' + category.name,
      fields: [
        {
          label: 'Médias liés',
          name: 'mediaLinks',
          type: 'mediaSelector',
          value: category.medias ?? [],
        },
      ],
      onSubmit: (data:any) => {
        this.modalService.setLoading(true); // ⏳ spinner ON


          const currentMedias = category.medias ?? [];
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
              linkedType: 'category',
              linkedId: category.id,
              role: 'gallery' as const,
            };

            this.mediaLinkService.createMediaLink(link).subscribe({
              next: (res) => {
                console.log('Lien créé :', res);
                this.fetchCategories();
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
            if(category.id)
            this.mediaLinkService
              .deleteMediaLinkByLinkedIdAndMediaId(category.id, mediaId)
              .subscribe({
                next: () => {
                  console.log(`Lien supprimé : media ${mediaId} de product ${category.id}`);
                  this.fetchCategories();
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
    })

    // this.modalService.open('Sélectionner un média pour la catégorie ' + category.name);

    // this.formModalService.openFormModal({
    //   title: 'Sélectionner un média pour ' + category.name,
    //   fields: [
    //     {
    //       label: 'Médias liés',
    //       name: 'mediaLinks',
    //       type: 'mediaSelector',
    //       value: category.medias ?? [],
    //     },
    //   ],
    //   onSubmit: (data) => {
    //     this.modalService.setLoading(true); // ⏳ spinner ON


    //       const currentMedias = category.medias ?? [];
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
    //           linkedType: 'category',
    //           linkedId: category.id,
    //           role: 'gallery' as const,
    //         };

    //         this.mediaLinkService.createMediaLink(link).subscribe({
    //           next: (res) => {
    //             console.log('Lien créé :', res);
    //             this.fetchCategories();
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
    //         if(category.id)
    //         this.mediaLinkService
    //           .deleteMediaLinkByLinkedIdAndMediaId(category.id, mediaId)
    //           .subscribe({
    //             next: () => {
    //               console.log(`Lien supprimé : media ${mediaId} de product ${category.id}`);
    //               this.fetchCategories();
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
