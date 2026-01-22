import { Component, input } from '@angular/core';
import { Product } from '@products/interfaces/product-response-interface';
import { ProductImagePipe } from '@products/pipes/product-image-pipe';
import { RouterLink } from "@angular/router";
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-products-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe, AsyncPipe],
  templateUrl: './products-table.html',
  styles: ``
})
export class ProductsTable {

  products = input.required<Product[]>();

  deleteProduct(product: Product) {
    console.log(product);
  }

}
