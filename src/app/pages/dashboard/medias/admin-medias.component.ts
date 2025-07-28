import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { FormModalService } from '../../../services/form-modal.service';
import { MediaType } from '../../../models/medias';
import { MediasService } from '../../../services/medias.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-medias',
  standalone: true,
  imports: [CommonModule,FormsModule],
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

  selectedOption: string = '5';
  options: string[] = ['3', '4', '5'];
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
        console.log(data);
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
        },
      ],
      onSubmit: async (data) => {
        console.log('Produit reçu :', data);
        this.addMediaAction(data).subscribe({
          next: (res) => {
            console.log('Produit ajouté :', res);
            this.getMedias();
            data.file = undefined
            this.formModalService.resetForm();

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
      onSubmit: (data) => {
        const updated = { ...media, ...data };
        if (media.id)
          this.mediaService.updateMedia(media.id, updated).subscribe({
            next: () => {
              this.getMedias();
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
      // this.http
      //   .delete(`${environment.apiUrl}/medias/${media.id}`, {
      //     withCredentials: true,
      //   })
      if (media.id)
        this.mediaService.deleteMedia(media.id)
        .subscribe({
          next: () => this.getMedias(),
          error: (err) => {
            console.error('Erreur suppression', err);
          },
        });
    }
  }
}
