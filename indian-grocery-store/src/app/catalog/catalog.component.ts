import { Component, Signal, signal } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ProductsService } from '../products.service';
import { IProduct } from '../product.model';
import allProducts from '../products.json'
@Component({
  selector: 'store-catalog',
  imports: [ProductDetailsComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {
products:IProduct[]=allProducts;
}
