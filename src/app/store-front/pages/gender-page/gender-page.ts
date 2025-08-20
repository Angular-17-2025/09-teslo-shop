import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCard } from "@products/components/product-card/product-card";
import { ProductsService } from '@products/services/products-service';
import { map } from 'rxjs';
import { Pagination } from "src/app/shared/pagination/pagination";
import { PaginationService } from 'src/app/shared/pagination/pagination-service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, TitleCasePipe, Pagination],
  templateUrl: './gender-page.html',
  styles: ``
})
export class GenderPage {

  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  gender = toSignal(
    this.route.params.pipe(
      map(({gender}) => gender)
    )
  );

  productGenderResource = rxResource({
    params: () => ({ gender: this.gender(), page: this.paginationService.pageNumberFromURL() -1 }),
    stream: ({params}) => this.productsService.getProducts({ gender: params.gender, offset: params.page * 9 })
  });

}
