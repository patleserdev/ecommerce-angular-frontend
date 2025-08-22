import { Injectable } from '@angular/core';
import { CartService } from './cart.service.js';
import { HttpClient } from '@angular/common/http/index.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CheckoutSessionService {
  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {}

  checkoutSessionId: string | null = null;

  startCheckout() {
    this.cartService.cartItems$.subscribe((cart) => {
      this.http
        .post('/api/checkout/session', { items: cart })
        .subscribe((session: any) => {
          this.checkoutSessionId = session.id;
          this.router.navigate(['/checkout/delivery']);
        });
    });
  }

  updateAddress(address: any) {
    this.http
      .patch(`/api/checkout/session/${this.checkoutSessionId}/address`, address)
      .subscribe();
  }

  updateShipping(carrier: any) {
    this.http
      .patch(
        `/api/checkout/session/${this.checkoutSessionId}/shipping`,
        carrier
      )
      .subscribe();
  }

  pay(paymentInfo: any) {
    this.http
      .post(`/api/checkout/session/${this.checkoutSessionId}/pay`, paymentInfo)
      .subscribe((order: any) => {
        this.router.navigate(['/checkout/confirmation', order.id]);
      });
  }
}
