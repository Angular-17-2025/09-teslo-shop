import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductResponseInterface } from '@products/interfaces/product-response-interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Options {
  limit?: number,
  gender?: string,
  offset?: number
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  httpClient = inject(HttpClient);

  getProducts(options: Options): Observable<ProductResponseInterface> {

    //Object destructuring
    const { limit = 9, gender = '', offset = 0} = options;

    return this.httpClient.get<ProductResponseInterface>(`${environment.API_BASE_URL}/products`, { params: {limit, gender, offset} })
               .pipe(
                tap( (resp) => console.log(resp))
               );
  }

  getProductImage(image_id: string) {
    return this.httpClient.get(`${environment.API_BASE_URL}/files/product/${image_id}`, { responseType: 'blob' }).pipe(
      map( resp => URL.createObjectURL(resp)),
      catchError(error => {
        console.log('Something went wrong in service.getProductImage: ', error);
        return of(null);
      })
    );
  }

  getProductBySlug(slug: string): Observable<Product>{
    return this.httpClient.get<Product>(`${environment.API_BASE_URL}/products/${slug}`).pipe(
      catchError((error) => {
        console.log('Something went wrong in service.getProductBySlug: ', error);
        return of(error)
      })
    )
  }

}
