import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products-service';
import { delay, map } from 'rxjs';

@Component({
  selector: 'app-admin-product',
  imports: [],
  templateUrl: './admin-product.html',
  styles: ``
})
export class AdminProduct {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  productsService = inject(ProductsService);

  productId = toSignal(
    this.activatedRoute.params.pipe(
      map((params) => params['id'])
    )
  );

  productResource = rxResource({
    params: () => ({product_id: this.productId}),
    stream: ({params}) => this.productsService.getProductByID(params.product_id())
  });

  productEffect = effect(() => {
    // We can use .erro() because in service we are not handling the error, we just pass the http request
    if(this.productResource.error()) {
      this.router.navigate(['/admin/products']);
    }
  });

}
