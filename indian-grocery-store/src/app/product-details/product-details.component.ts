import { Component, computed, input, output, signal } from '@angular/core';
import { IProduct } from '../product.model';
import { CommonModule } from '@angular/common';
import { CategoryToPipeTypePipe } from '../category-to-pipe-type-pipe';
import { SlidderComponent } from '../slidder/slidder.component';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'store-product-details',
  imports: [CommonModule, CategoryToPipeTypePipe,SlidderComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product = input.required<IProduct,IProduct>({transform:this.normalizeDiscount});
  mode = input<'shop' | 'cart'>('shop');
  addToCart = output<IProduct>();
  removeFromCart=output<IProduct>()
  constructor(private inventoryService:InventoryService){

  }
  availableInventory = computed(()=>this.inventoryService.get(this.product().id))
  favorite=signal(0)
  inventoryMap = {
    '=0': 'Out of Stock!!!',
    '=1': ' Only one left!',
    '=2': 'Few left!',
    '=3': 'Few left!',
    '=4': 'Few left!',
    other: 'Get your today !',
  };
  normalizeDiscount(product:IProduct)
  {
   if (product.discount<1)
   {
    return product;
   }
   return {...product, discount:product.discount/100}
  }
  add() {
    this.addToCart.emit(this.product());
  }
  remove(){
    this.removeFromCart.emit(this.product())
  }
  getImageUrl(product: IProduct) {
    return '/assets/' + product.imageName;
  }
 
  getPricesClasses() {
    return { strikethrough: this.product().discount > 0 };
  }
  handleSlidderValueChange(newValue:number)
  {
  console.log("Value of slidder:",newValue)
  }
}
