import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { FormModalService } from '../../../services/form-modal.service';
import { MediaType } from '../../../models/medias';
import { MediasService } from '../../../services/medias.service';
import { FormsModule } from '@angular/forms';
import { PictureModalComponent } from '../../../shared/picture-modal/picture-modal.component';
import { FormModalComponent } from '../../../shared/form-modal/form-modal.component.js';
@Component({
  selector: 'app-admin-medias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-medias.component.html',
  styleUrl: './admin-medias.component.css',
})
export class AdminMediasComponent {
  constructor(
    private modalService: ModalService,
    private formModalService: FormModalService,
    private mediaService: MediasService
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
  errorMessage$ = this.formModalService.errorMessage$;

  /** Gestion de la taille de grille */
  selectedOption = '6'; // valeur par défaut
  options = ['1', '2', '3', '4', '5', '6'];
  gridColsClass: { [key: string]: string } = {
    '1': 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1',
    '2': 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2',
    '3': 'sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3',
    '4': 'sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4',
    '5': 'sm:grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5',
    '6': 'sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6',
  };
  /**
   * ON INIT
   */
  ngOnInit() {
    this.getMedias();
  }

  getMedias() {
    this.mediaService.getMedias().subscribe({
      next: (data) => {
        this.medias = data.sort((a, b) => a.title.localeCompare(b.title));
        // console.log(data);
      },
      error: (err) => {
        console.error('Erreur lors du fetch des catégories', err);
      },
    });
  }

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

  openPictureInModal(media_url: string | undefined) {
    // console.log("opened")
    if (media_url) {
      // this.modalService.setDynamicComponent(PictureModalComponent);
      // this.modalService.setModalData({ media_url });
      // this.modalService.open('Aperçu de l’image');
      this.modalService.openWithComponent('Voir image', PictureModalComponent, {
        media_url: media_url,
      });
    }
  }

  addMediaAction(datas: MediaType) {
    const formData = new FormData();

    if (datas.file) {
      formData.append('file', datas.file);
    }

    // Ajout des autres champs si définis
    if (datas.title) formData.append('title', datas.title);
    if (datas.description) formData.append('description', datas.description);
    if (datas.altText) formData.append('altText', datas.altText);
    if (datas.fileName) formData.append('fileName', datas.fileName);
    if (datas.height !== undefined)
      formData.append('height', String(datas.height));
    if (datas.width !== undefined)
      formData.append('width', String(datas.width));

    return this.mediaService.addMedia(formData);
  }

  addMedia() {
    // this.modalService.open('Ajouter un média');
    this.modalService.openWithComponent(
      'Ajouter un média',
      FormModalComponent,
      {
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
          },
        ],
        onSubmit: async (data: any) => {
          console.log('Media reçu :', data);
          this.modalService.setLoading(true);
          this.addMediaAction(data).subscribe({
            next: (res) => {
              console.log('Media ajouté :', res);
              this.getMedias();
              data.file = undefined;
              this.formModalService.resetForm();

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

    // this.formModalService.openFormModal({
    //   title: 'Ajouter un média',
    //   fields: [
    //     { label: 'Nom', name: 'title', type: 'text', required: true },
    //     // { label: 'Image URL', name: 'image', type: 'text' },
    //     { label: 'Description', name: 'description', type: 'textarea' },
    //     {
    //       label: 'Image',
    //       name: 'file',
    //       type: 'file',
    //       required: true,
    //     },
    //   ],
    //   onSubmit: async (data) => {
    //     console.log('Produit reçu :', data);
    //     this.addMediaAction(data).subscribe({
    //       next: (res) => {
    //         console.log('Produit ajouté :', res);
    //         this.getMedias();
    //         data.file = undefined
    //         this.formModalService.resetForm();

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

  editMedia(media: MediaType) {
    // this.modalService.open('Modifier un produit');
    this.modalService.openWithComponent(
      'Modifier un Média',
      FormModalComponent,
      {
        title: 'Modifier un Média',
        fields: [
          {
            label: 'Nom',
            name: 'title',
            type: 'text',
            required: true,
            value: media.title,
          },
          {
            label: 'Description',
            name: 'description',
            type: 'textarea',
            value: media.description,
          },
          {
            label: 'Image',
            name: 'file',
            type: 'file',
            required: true,
            value: media.url,
          },
        ],
        onSubmit: (data: any) => {
          this.modalService.setLoading(true);
          const formData = new FormData();

          if (data.title) formData.append('title', data.title);
            if (data.description) formData.append('description', data.description || '');

            if (data.altText) formData.append('altText', data.altText);
            if (data.fileName) formData.append('fileName', data.fileName);
            if (data.height !== undefined)
              formData.append('height', String(data.height));
            if (data.width !== undefined)
              formData.append('width', String(data.width));

            // Ajoute le fichier seulement s'il a changé (type File)
            if (data.file instanceof File) {
              formData.append('file', data.file);
            } else {

              formData.append('fileUrl', data.file);
            }

          if (media.id) {
          this.mediaService.updateMedia(media.id, formData).subscribe({
            next: () => {
              console.log('media updated');
              this.getMedias();
              this.modalService.close();
              this.formModalService.close();
              this.modalService.setLoading(false);
            },
            error: (err) => {
              const msg =
                err?.error?.message || 'Erreur lors de la mise à jour.';
              this.formModalService.setError(msg);
              this.modalService.setLoading(false);
            },
          });
        }
        },
      }
    );
  }

  deleteMedia(media: MediaType) {
    if (confirm(`Supprimer le media "${media.title}" ?`)) {
      // this.http
      //   .delete(`${environment.apiUrl}/medias/${media.id}`, {
      //     withCredentials: true,
      //   })
      if (media.id) {
        this.modalService.setLoading(false);
        this.mediaService.deleteMedia(media.id).subscribe({
          next: () => this.getMedias(),
          error: (err) => {
            console.error('Erreur suppression', err);
          },
        });
        this.modalService.setLoading(false);
      }
    }
  }
}
