import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { links } from '../links';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class DashboardHomeComponent {
  role: string | null = null; // 👈 ajoute ça
  links = links;
  constructor(private router: Router, private auth: AuthService) {
    this.auth.role$.subscribe((role) => {
      this.role = role;
      console.log(this.role)
    });

  }

  get filteredLinks() {
    return this.links.filter((link) => link.path !== this.router.url);
  }

  get visibleLinks() {
    if (!this.role) return []; // évite erreur pendant le chargement
    return this.links.filter((link) => link.path !== this.router.url && link.roles.includes(this.role!));
  }
}
