import { rxResource } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products-service';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
  styles: ``
})
export class ProductPage {

  productService = inject(ProductsService);
  route = inject(ActivatedRoute);
  product_id = this.route.snapshot.params['product_id'];

  productResource = rxResource({
    stream: () => this.productService.getProductBySlug(this.product_id)
  });

}
