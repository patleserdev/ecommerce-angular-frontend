import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(public authService: AuthService,private router:Router) {} // injecté normalement

  logout() {
    this.authService.logout().subscribe(() => {
      console.log('Déconnexion réussie');
      this.router.navigate(['/auth/login']);
    });
  }
}
