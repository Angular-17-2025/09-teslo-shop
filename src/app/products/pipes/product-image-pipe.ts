import { Pipe, PipeTransform, inject } from '@angular/core';
import { ProductsService } from '@products/services/products-service';
import { of } from 'rxjs';

@Pipe({
  name: 'productImagePipe'
})
export class ProductImagePipe implements PipeTransform {

  productService = inject(ProductsService);

  transform(value: string | string[]) {

    // When the user only send one image
    if(typeof value === 'string') {
      return this.productService.getProductImage(value);
    }

    // When the user send an array of images
    const image = value.at(0);

    if(image) {
      return this.productService.getProductImage(image);
    } else {
      return of('./assets/images/no-image.jpg');
    }
  }

}
