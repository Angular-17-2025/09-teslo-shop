import { Component, inject, signal } from '@angular/core';
import { ProductCard } from "../../../products/components/product-card/product-card";
import { ProductsService } from '@products/services/products-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductResponseInterface } from '@products/interfaces/product-response-interface';
import { map } from 'rxjs';
import { Pagination } from "src/app/shared/pagination/pagination";
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from 'src/app/shared/pagination/pagination-service';

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
  paginationService = inject(PaginationService);

  productsResource = rxResource({
    params: () => ({ page: this.paginationService.pageNumberFromURL() - 1 }),
    stream: ({params}) => this.productsService.getProducts({ offset: params.page * 9 }).pipe(
      map((resp) => this.products.set(resp))
    )
  });

}

