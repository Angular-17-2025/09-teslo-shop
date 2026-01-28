import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsTable } from "@products/components/products-table/products-table";
import { ProductResponseInterface } from '@products/interfaces/product-response-interface';
import { ProductsService } from '@products/services/products-service';
import { map } from 'rxjs';
import { PaginationService } from 'src/app/shared/pagination/pagination-service';
import { Pagination } from "src/app/shared/pagination/pagination";
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  imports: [ProductsTable, Pagination, FormsModule, RouterLink],
  templateUrl: './admin-products.html',
  styles: ``
})
export class AdminProducts {

  private productsService = inject(ProductsService);
  readonly paginationService = inject(PaginationService);
  productsPerPage = signal<number>(10);
  products = signal<ProductResponseInterface | null>(null);
  router = inject(Router);

  changeProductsPerPage = effect(() => {
    const newLimit = this.productsPerPage();
    const currentPage = this.paginationService.pageNumberFromURL();

    // Get the total number of items from the resource response
    const totalItems = this.products()?.count ?? 0;

    // Calculate the maximum possible page number for the new limit(.ceil() round to entire number)
    const maxPage = totalItems > 0 ? Math.ceil(totalItems / newLimit) : 1;

    // Check if the current page is greater than the new max page
    // or if the current page is 0 (shouldn't happen, but good safeguard)
    if (currentPage > maxPage || currentPage < 1) {
      // Navigate to the same route, but set the page query param to 1
      this.router.navigate(
        [],
        {
          queryParams: { page: 1 },
          queryParamsHandling: 'merge' // Keep other query params if there are any
        }
      );
    }
  }, { allowSignalWrites: true });

  productsResource = rxResource({
    params: () => ({
      page: this.paginationService.pageNumberFromURL() - 1,
      limit: this.productsPerPage()
    }),
    stream: ({params}) => this.productsService.getProducts({
      offset: params.page * params.limit,
      limit: params.limit
    }).pipe(
      map((resp) => this.products.set(resp))
    )
  });

  reloadProducts() {
    this.productsService.productsCache.clear();
    this.productsResource.reload();
  }

}
