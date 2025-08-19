import { Component, inject, signal } from '@angular/core';
import { ProductCard } from "../../../products/components/product-card/product-card";
import { ProductsService } from '@products/services/products-service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductResponseInterface } from '@products/interfaces/product-response-interface';
import { map } from 'rxjs';
import { Pagination } from "src/app/shared/pagination/pagination";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html',
  styles: ``
})
export class HomePage {

  products = signal<ProductResponseInterface | null>(null);
  productsService = inject(ProductsService);
  route = inject(ActivatedRoute);

  currentPageFromURL = toSignal(
    this.route.queryParamMap.pipe(
      // When you add "+" to any property, it become in a number
      map((params) => (params.get('page') ? +params.get('page')! : 1)),
      map((page) => (isNaN(page) ? 1 : page))
    ),
    {
      initialValue: 1
    }
  );

  productsResource = rxResource({
    params: () => ({ page: this.currentPageFromURL() - 1 }),
    stream: ({params}) => this.productsService.getProducts({ offset: params.page * 9 }).pipe(
      map((resp) => this.products.set(resp))
    )
  });

}

