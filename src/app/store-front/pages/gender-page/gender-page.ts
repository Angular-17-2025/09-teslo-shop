import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCard } from "@products/components/product-card/product-card";
import { ProductsService } from '@products/services/products-service';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, TitleCasePipe],
  templateUrl: './gender-page.html',
  styles: ``
})
export class GenderPage {

  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  gender = signal<string>('');

  productGenderResource = rxResource({
    stream: () => this.route.paramMap.pipe(
      map((params) => this.gender.set(params.get('gender')!)),
      switchMap(() => this.productsService.getProducts({ gender: this.gender() }))
    )
  });

}
