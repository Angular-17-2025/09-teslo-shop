import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsTable } from "@products/components/products-table/products-table";
import { ProductResponseInterface } from '@products/interfaces/product-response-interface';
import { ProductsService } from '@products/services/products-service';
import { map } from 'rxjs';
import { PaginationService } from 'src/app/shared/pagination/pagination-service';
import { Pagination } from "src/app/shared/pagination/pagination";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  imports: [ProductsTable, Pagination, FormsModule],
  templateUrl: './admin-products.html',
  styles: ``
})
export class AdminProducts {

  private productsService = inject(ProductsService);
  readonly paginationService = inject(PaginationService);

  products = signal<ProductResponseInterface | null>(null);

  productsResource = rxResource({
    params: () => ({page: this.paginationService.pageNumberFromURL() - 1}),
    stream: ({params}) => this.productsService.getProducts({offset: params.page * 9}).pipe(
      map((resp) => this.products.set(resp))
    )
  });

}
