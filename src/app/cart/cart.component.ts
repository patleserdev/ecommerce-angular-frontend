import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cart$ = this.cartService.cartItems$;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cart$.subscribe((cart) => {
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
}
