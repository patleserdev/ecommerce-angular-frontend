// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartType } from '../models/cart.js';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartType[]>([]);
  cartItems$ = this.cartSubject.asObservable();
  cartLength$ = this.cartItems$.pipe(map(cart => cart.length));

  constructor() { if (typeof window !== 'undefined' && window.localStorage) {
    this.loadCartFromStorage();
  }}

  private loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        this.cartSubject.next(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('localStorage inaccessible :', err);
    }
  }

  private saveCartToStorage(cart: CartType[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }



  add(item: CartType) {
    const current = [...this.cartSubject.value, item];
    this.cartSubject.next(current);
    this.saveCartToStorage(current);
  }

  removeFromCart(index: number) {
    const current = [...this.cartSubject.value];
    current.splice(index, 1);
    this.cartSubject.next(current);
    this.saveCartToStorage(current);
  }

  removeFromCartByVariationId(productId: number,variationId:number) {
    const current = [...this.cartSubject.value];
    const index = current.findIndex(
      item => item.product.id === productId && item.variation.id === variationId
    );

    if (index !== -1) {
      current.splice(index, 1);
      this.cartSubject.next(current);
      this.saveCartToStorage(current);
    }
  }

  clearCart() {
    this.cartSubject.next([]);
    this.saveCartToStorage([]);
  }

  getTotal(): number {
    return this.cartSubject.value.reduce((sum, item) => sum + item.product.price, 0);
  }

}
