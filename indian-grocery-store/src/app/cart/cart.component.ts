import { Component, signal } from '@angular/core';
import { CartService } from '../cart.service';
import { IProduct } from '../product.model';
import { ProductDetailsComponent } from '../product-details/product-details.component';
@Component({
  selector: 'store-cart',
  imports: [ProductDetailsComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {

  cartItems=signal<IProduct[]>([])
  
  
  constructor(private cartService:CartService){
    this.cartItems=this.cartService.cart
  }

  removeFromCart(prod:IProduct){
   this.cartService.removeItemsFromCart(prod)
  }
}
