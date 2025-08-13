import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ResponsiveService {
  private mobileBreakpoint = 768;
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  isMobile$ = this.isMobileSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Init valeur
      this.isMobileSubject.next(window.innerWidth <= this.mobileBreakpoint);

      // Écoute resize
      window.addEventListener('resize', () => this.onResize());
    }
  }

  private onResize() {
    this.isMobileSubject.next(window.innerWidth <= this.mobileBreakpoint);
  }
}
