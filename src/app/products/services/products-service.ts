import { UserInterface } from '@auth/interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductResponseInterface } from '@products/interfaces/product-response-interface';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  productsCache = new Map<string, ProductResponseInterface>();
  emptyProduct: Product = {
    id:          'new',
    title:       '',
    price:       0,
    description: '',
    slug:        '',
    stock:       0,
    sizes:       [],
    gender:      Gender.Men,
    tags:        [],
    images:      [],
    user:        {} as UserInterface,
  }

  getProducts(options: Options): Observable<ProductResponseInterface> {

    //Object destructuring
    const { limit = 9, gender = '', offset = 0} = options;

    // Create the key to set indentifier to the cache of products to storage
    const keyCache = `${limit}-${offset}-${gender}`;

    // If productsCache map has the key, return from cache and avoid call the API
    if(this.productsCache.has(keyCache)) {
      console.log('Return products from cache');
      return of(this.productsCache.get(keyCache)!);
    }

    return this.httpClient.get<ProductResponseInterface>(`${environment.API_BASE_URL}/products`, { params: {limit, gender, offset} })
               .pipe(
                tap( (resp) => console.log(resp)),
                tap( (resp) => this.productsCache.set(keyCache, resp)) // Set the key and as value the resp
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

  getProductByID(id: string): Observable<Product>{

    if(id == 'new') {
      return of(this.emptyProduct);
    }

    return this.httpClient.get<Product>(`${environment.API_BASE_URL}/products/${id}`);
  }

  updateProduct(productID: string, product: Partial<Product>, newImages: File[], productImages: string[]): Observable<Product> {

    product.images = productImages;

    if(newImages.length > 0) {
      return this.uploadImages(newImages).pipe(
        map((newImagesIDs) => ({
            ...product,
            images: [ ...product.images ?? [], ...newImagesIDs ]
          })
        ),
        // To link observables, first wait for uploadImages() and after execute updateRequest()
        switchMap((productWithImages) =>
          this.updateRequest(productID, productWithImages)
        )
      );
    }

    return this.updateRequest(productID, product);
  }

  updateRequest(productID: string, product: Partial<Product>): Observable<Product> {
    return this.httpClient.patch<Product>(`${environment.API_BASE_URL}/products/${productID}`, product).pipe(
      tap((product) => this.updateCache(product)),
      catchError((error) => {
        console.log('Something went wronf in products-service.updateProduct: ', error);
        return of(error);
      })
    );
  }

  createProduct(product: Partial<Product>, productImagesFiles: File[]): Observable<Product> {

    if(productImagesFiles.length > 0) {

      return this.uploadImages(productImagesFiles).pipe(
        map((images) => ({
            ...product,
            images: [ ...images ]
          })
        ),
        switchMap((productWithImages) =>  this.createProductRequest(productWithImages))
      );
    }
    return this.createProductRequest(product);
  }

  createProductRequest(product: Partial<Product>): Observable<Product> {
    return this.httpClient.post<Product>(`${environment.API_BASE_URL}/products`, product).pipe(
      tap(() => this.productsCache.clear())
    );
  }

  updateCache(updatedProduct: Partial<Product>) {
    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map((oldProduct) => oldProduct.id == updatedProduct.id ? updatedProduct as any : oldProduct);
    });
  }

  uploadImages(images: File[]): Observable<string[]> {
    if(!images) return of([]);

    const requestForImage = Array.from(images).map((image) =>
      this.uploadImage(image)
    );

    // To execute several Observables at time and wait for them
    return forkJoin<string[]>(requestForImage);
  }

  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', image);

    return this.httpClient.post<{fileName: string}>(`${environment.API_BASE_URL}/files/product`, formData).pipe(
      map((resp) => resp.fileName)
    );
  }

  deleteProduct(productID: string): Observable<Boolean> {
    return this.httpClient.delete<boolean>(`${environment.API_BASE_URL}/products/${productID}`);
  }

}
