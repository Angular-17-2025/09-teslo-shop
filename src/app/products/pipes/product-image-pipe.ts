import { Pipe, PipeTransform, inject } from '@angular/core';
import { ProductsService } from '@products/services/products-service';
import { of } from 'rxjs';

@Pipe({
  name: 'productImagePipe'
})
export class ProductImagePipe implements PipeTransform {

  productService = inject(ProductsService);

  transform(value: string | string[]) {

    // Local images, created when user select new ones to upload
    if(value.includes("blob")) {
      return of(value);
    }

    // Display when is a new product
    if (value == '' ) {
      return of('./assets/images/no-image.jpg');
    }

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
