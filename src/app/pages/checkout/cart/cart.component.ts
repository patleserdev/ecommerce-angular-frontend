import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartCheckoutComponent implements OnInit {
  cart$ = this.cartService.cartItems$;
  total = 0;

  constructor(private cartService: CartService,private authService : AuthService,private router :Router) {}

  ngOnInit(): void {
    this.cart$.subscribe((cart) => {
      this.total=this.cartService.getTotal()
      console.log('Contenu du panier:', cart);
    });

  }

  remove(index: number) {
    this.cartService.removeFromCart(index);
  }

  clear() {
    const result = confirm('Etes-vous sûr de vouloir vider le panier ?');
    if (result) {
      this.cartService.clearCart();
    }
  }

  checkout() {
    if (this.authService.checkAuth()) {
      // Utilisateur connecté → étape 1 : validation du panier
      this.router.navigate(['/checkout/delivery']);
    } else {
      // Non connecté → rediriger vers login
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/checkout/delivery' } // après login, retour
      });
    }
  }


}
