import { Component, inject } from '@angular/core';
import { ProductCard } from "../../../products/components/product-card/product-card";
import { ProductsService } from '@products/services/products-service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard],
  templateUrl: './home-page.html',
  styles: ``
})
export class HomePage {

  productsService = inject(ProductsService);

  productsResource = rxResource({
    stream: () => this.productsService.getProducts({})
  });

}

