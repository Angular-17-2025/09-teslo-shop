import { AsyncPipe, SlicePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product-response-interface';
import { ProductImagePipe } from '@products/pipes/product-image-pipe';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe, AsyncPipe],
  templateUrl: './product-card.html',
  styles: ``
})
export class ProductCard {

  product = input.required<Product>();

}
