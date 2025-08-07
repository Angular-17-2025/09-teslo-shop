import { Pipe, PipeTransform, inject } from '@angular/core';
import { ProductsService } from '@products/services/products-service';
import { of } from 'rxjs';

@Pipe({
  name: 'productImagePipe'
})
export class ProductImagePipe implements PipeTransform {

  productService = inject(ProductsService);

  transform(images: Array<string>) {

    if(images.length > 0) {

      return this.productService.getProductImage(images[0]);

    } else {
      return of('./assets/images/no-image.jpg');
    }
  }

}
