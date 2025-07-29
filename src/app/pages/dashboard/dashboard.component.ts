import { Component } from '@angular/core';
import { RouterOutlet,NavigationStart ,NavigationEnd,NavigationCancel,NavigationError} from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { links } from './links';

@Component({
  selector: 'app-dashboard',
  // standalone: true,
  // imports: [
  //   RouterOutlet,
  //   HeaderComponent,
  //   FooterComponent,
  //   CommonModule,
  //   RouterLink,
  // ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  role: string | null = null; // 👈 ajoute ça
  loading = true;

  links = links;
  constructor(private router: Router, private auth: AuthService) {
    this.auth.role$.subscribe((role) => {
      this.role = role;
      // console.log(role)
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loading = false;
      }
    });
  }

  getLinkClasses(path: string): Record<string, boolean> {
    const isActive = this.router.url === path;
    return {
      'text-white bg-blue-600 font-semibold': isActive,
      'text-gray-600 hover:bg-gray-100': !isActive,
    };
  }

  get currentLabel(): string {
    const found = this.links.find((link) => link.path === this.router.url);
    return found ? found.label : 'Dashboard';
  }

  get visibleLinks() {
    if (!this.role) return []; // évite erreur pendant le chargement
    return this.links.filter((link) => link.roles.includes(this.role!));
  }
}
