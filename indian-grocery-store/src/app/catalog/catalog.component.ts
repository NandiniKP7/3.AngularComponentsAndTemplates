import { Component, Signal, signal } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ProductsService } from '../products.service';
import { IProduct } from '../product.model';
import allProducts from '../products.json';
import { CategoryTofilterPipePipe } from '../category-tofilter-pipe-pipe';
import { CartService } from '../cart.service';
@Component({
  selector: 'store-catalog',
  imports: [ProductDetailsComponent,CategoryTofilterPipePipe],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {
  products: IProduct[] = allProducts;
  categoryFilter: string | null = null;

  constructor(private cartService:CartService){

}
addToCart(prod:IProduct) {
    //setTimeout(() => this.availableInventory.update((p) => p - 1), 100);
    this.cartService.addItemsTocart(prod)

  }
  addProdict() {
    this.products=[...this.products,{
      "id": 10,
      "name": 'Maggi',
      "description":
        'Flattened rice commonly used to prepare poha, snacks, and light breakfast dishes.',
      "imageName": 'poha.png',
      "category": 'grains',
      "productNotes": 'This product is sometimes not in stock',
      "price": 4.99,
      "discount": 0,
    }];
  }
}
