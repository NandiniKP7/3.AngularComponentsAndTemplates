import { Component, input, output, signal } from '@angular/core';
import { IProduct } from '../product.model';
import { CommonModule } from '@angular/common';
import { CategoryToPipeTypePipe } from '../category-to-pipe-type-pipe';

@Component({
  selector: 'store-product-details',
  imports: [CommonModule, CategoryToPipeTypePipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product = input.required<IProduct>();
  mode = input<'shop' | 'cart'>('shop');
  addToCart = output<IProduct>();
  removeFromCart=output<IProduct>()
  availableInventory = signal(5);
  inventoryMap = {
    '=0': 'Out of Stock!!!',
    '=1': ' Only one left!',
    '=2': 'Few left!',
    '=3': 'Few left!',
    '=4': 'Few left!',
    other: 'Get your today !',
  };
  add() {
    this.addToCart.emit(this.product());
  }
  remove(){
    this.addToCart.emit(this.product())
  }
  getImageUrl(product: IProduct) {
    return '/assets/' + product.imageName;
  }

  getPricesClasses() {
    return { strikethrough: this.product().discount > 0 };
  }
}
