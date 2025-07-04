import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component.js';
import { FooterComponent } from '../../shared/footer/footer.component.js';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent,CommonModule,RouterLink],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {

}
