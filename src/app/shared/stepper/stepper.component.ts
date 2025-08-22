import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './stepper.component.html'
})
export class StepperComponent {
  steps = [
    { id: 1, name: 'panier', url: '/checkout/cart' },
    { id: 2, name: 'livraison', url: '/checkout/delivery' },
    { id: 3, name: 'paiement', url: '/checkout/payment' },
    { id: 4, name: 'confirmation', url: '/checkout/confirmation' }
  ];

  currentUrl = '';

  constructor(private router: Router) {
    // on écoute les changements de route pour savoir où on est
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects;
      });
  }
}
