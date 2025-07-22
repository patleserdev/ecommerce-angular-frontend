import { Component } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { AuthService } from './services/auth.service.js';
import { ModalService } from './services/modal.service.js';
import { SharedModule } from './shared/shared.module.js';
import { FormModalService } from './services/form-modal.service.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private authService: AuthService,private modalService: ModalService,public formModalService: FormModalService) {}

  visible$ = this.modalService.visible$;
  title$ = this.modalService.title$;

  fields$ = this.formModalService.fields$;

  dynamicComponent$ = this.modalService.dynamicComponent$;


  title = 'ecommerce-angular-frontend';


  // ngOnInit() {
  //   this.authService.checkAuth();
  // }
  ngOnInit() {
    this.authService.checkAuth().subscribe();

    this.authService.fetchUserProfile().subscribe({
      next: () => {},
      error: () => {
        // Non connecté, peut rediriger ou faire autre chose
      }
    });
  }
}
