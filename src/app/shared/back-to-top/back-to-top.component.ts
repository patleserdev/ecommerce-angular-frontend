import { Component, HostListener, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ResponsiveService } from '../../services/responsive.service.js';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.css',
})
export class BackToTopComponent {
  showScrollTop = false;
  isMobile = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private responsiveService: ResponsiveService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.responsiveService.isMobile$.subscribe(isMobile => {
        this.isMobile = isMobile;

        // Réinitialiser le bouton si on passe en mobile
        if (isMobile) {
          this.showScrollTop = false;
        }
      });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      // Ne rien faire en version mobile
      if (this.isMobile) {
        this.showScrollTop = false;
        return;
      }

      this.showScrollTop = window.scrollY > 100;
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
}
