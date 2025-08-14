import { Component, inject, signal } from '@angular/core';
import { ProductCard } from "../../../products/components/product-card/product-card";
import { ProductsService } from '@products/services/products-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductResponseInterface } from '@products/interfaces/product-response-interface';
import { map } from 'rxjs';
import { Pagination } from "src/app/shared/pagination/pagination";

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html',
  styles: ``
})
export class HomePage {

  products = signal<ProductResponseInterface | null>(null);

  productsService = inject(ProductsService);

  productsResource = rxResource({
    stream: () => this.productsService.getProducts({}).pipe(
      map((resp) => this.products.set(resp))
    )
  });

}

