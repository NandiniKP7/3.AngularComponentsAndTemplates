import { Component, input, signal } from '@angular/core';
import { IProduct } from '../product.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';
import { CategoryToPipeTypePipe } from '../category-to-pipe-type-pipe';

@Component({
  selector: 'store-product-details',
  imports: [CommonModule, CategoryToPipeTypePipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product = input.required<IProduct>();
  availableInventory = signal(5);
  inventoryMap={
    '=0' :'Out of Stock!!!' ,
    '=1':' Only one left!' ,
    '=2': 'Few left!',
    '=3': 'Few left!',
    '=4':'Few left!',
    "other":'Get your today !'
  }
constructor(private cartService:CartService){

}
  getImageUrl(product: IProduct) {
    return '/assets/' + product.imageName;
  }
  addToCart(event: MouseEvent) {
    setTimeout(() => this.availableInventory.update((p) => p - 1), 100);
    this.cartService.addItemsTocart(this.product())

  }
  getPricesClasses() {
    return {strikethrough:this.product().discount>0}
  }
}
