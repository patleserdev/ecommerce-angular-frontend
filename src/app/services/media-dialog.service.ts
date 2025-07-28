import { Injectable } from '@angular/core';
import { FormModalService } from './form-modal.service';
import { MediaType } from '../models/medias';
import { MediasService } from './medias.service';

@Injectable({ providedIn: 'root' })
export class MediaDialogService {
  constructor(
    private formModalService: FormModalService,
    private mediaService: MediasService
  ) {}

  openMediaModal(onMediaAdded: (media: MediaType) => void) {
    this.formModalService.pushFormModal({
      title: 'Ajouter un média',
      fields: [
        { label: 'Nom', name: 'title', type: 'text', required: true },
        { label: 'Description', name: 'description', type: 'textarea' },
        {
          label: 'Image',
          name: 'file',
          type: 'file',
          required: true,
        },
      ],
      onSubmit: (data) => {
        const formData = new FormData();
        if (data.file) formData.append('file', data.file);
        if (data.title) formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);

        this.mediaService.addMedia(formData).subscribe({
          next: (newMedia) => {
            onMediaAdded(newMedia);
            this.formModalService.popFormModal(); // 👈 on revient au formulaire précédent
          },
          error: (err) => {
            this.formModalService.setError(
              err?.error?.message || 'Erreur lors de l’ajout du média.'
            );
          },
        });
      },
    });
  }
}
