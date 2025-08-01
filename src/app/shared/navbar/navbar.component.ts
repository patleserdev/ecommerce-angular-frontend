import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';
import { AuthService } from '../../services/auth.service.js';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart.service.js';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    RouterLinkActive,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private cartService: CartService
  ) {
    this.cartLength$ = this.cartService.cartLength$;

    // referme le menu lors d'une navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.closeMobileMenu());
  }

  cartLength$: Observable<number>;

  categories: any[] = [];

  cartQuantity: number = 0;

  username: string = '';

  ngOnInit() {
    this.fetchCategories();
    this.authService.fetchUserProfile().subscribe((user) => {
      this.username = user.username;
    });
  }

  getUsername(): string {
    return this.username.charAt(0).toUpperCase() + this.username.slice(1);
  }

  fetchCategories() {
    this.http
      .get<any[]>(`${environment.apiUrl}/categories`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (err) => {
          console.error('Erreur lors du fetch des catégories', err);
        },
      });
  }
  isCategoryMobileOpen = false;

  isMenuOpen = false;
  isAnimating = false;
  menuAnimationClass = '';

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.isCategoryMobileOpen = false;
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      // Slide up (fermeture)
      this.menuAnimationClass = 'animate-slide-up';
      this.isAnimating = true;

      setTimeout(() => {
        this.isMenuOpen = false;
        this.isAnimating = false;
      }, 300); // Durée de l’animation
    } else {
      // Slide down (ouverture)
      this.isMenuOpen = true;
      this.menuAnimationClass = 'animate-slide-down';
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      const result = confirm('Etes-vous sûr de vouloir vous déconnecter ?');
      if (result) {
        console.log('Déconnexion réussie');
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
