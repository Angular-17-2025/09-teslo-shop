import { Component, input } from '@angular/core';
import { Product } from '@products/interfaces/product-response-interface';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";

@Component({
  selector: 'app-product-form',
  imports: [ProductCarousel],
  templateUrl: './product-form.html',
  styles: ``
})
export class Productform {

  product = input.required<Product>();

  sizes = ['XS', 'SM', 'MD', 'L', 'XL', 'XLL']

}
