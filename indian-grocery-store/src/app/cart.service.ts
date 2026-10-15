import { Injectable, signal } from '@angular/core';
import { IProduct } from './product.model';
import { InventoryService } from './inventory.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = signal<IProduct[]>([]);
  constructor(private inventoryService: InventoryService) {}
  addItemsTocart(product: IProduct) {
    this.inventoryService.decrement(product.id);
    this.cart.update((cart) => [...cart, product]);
  }

  // removeItemsFromCart(product: IProduct) {
  //   this.inventoryService.increment(product.id);
  //   this.cart.update((cart) => cart.filter((p) => p.id !== product.id));
  // }
  removeItemsFromCart(product: IProduct) {
    this.inventoryService.increment(product.id);
    const currentCart = this.cart();
    const index = currentCart.findIndex((p) => p.id === product.id);
    if (index === -1) {
      return;
    }
    this.inventoryService.increment(product.id);
    this.cart.set([...currentCart.slice(0, index), ...currentCart.slice(index + 1)]);
  }
}
