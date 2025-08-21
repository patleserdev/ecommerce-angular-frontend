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
  isHiding = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private responsiveService: ResponsiveService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.responsiveService.isMobile$.subscribe(isMobile => {
        this.isMobile = isMobile;
        if (isMobile) {
          this.showScrollTop = false;
        }
      });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const scrollPosition = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolledPercentage = (scrollPosition / totalHeight) * 100;

      if (this.isMobile) {
        this.showScrollTop = scrolledPercentage > 30;
      } else {
        this.showScrollTop = scrollPosition > 100;
      }
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isMobile) {
        this.isHiding = true; // animation disparition mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          this.showScrollTop = false;
          this.isHiding = false;
        }, 1000); // durée animation
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
}
