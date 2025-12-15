import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '@products/interfaces/product-response-interface';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from 'src/app/shared/components/form-error-label/form-error-label';
import { ProductsService } from '@products/services/products-service';
import { Router, RouterLink } from "@angular/router";
import { delay } from 'rxjs';

@Component({
  selector: 'app-product-form',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel, RouterLink],
  templateUrl: './product-form.html',
  styles: ``
})
export class Productform  implements OnInit{

  product = input.required<Product>();
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  productsService = inject(ProductsService);
  wasSaved = signal<boolean>(false);
  toastMsg = signal<string>("")

  sizesMap = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  productForm = this.formBuilder.group({
    title: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(1)]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
    sizes: [['']],
    images: [[]]
  });

  ngOnInit(): void {
    this.setFormValues(this.product());
  }

  setFormValues(product: Partial<Product>) {
    this.productForm.reset(product as any);
    this.productForm.patchValue({tags: product.tags?.join(', ')});
  }

  clickSize(size: string) {
    const productSizes = new Set(this.productForm.value.sizes ?? []);

    productSizes.has(size) ? productSizes.delete(size) : productSizes.add(size);

    const sizesSorted = this.sizesMap.filter(sizeMap => productSizes.has(sizeMap));

    this.productForm.patchValue({sizes: sizesSorted});
  }

  submitForm() {

    this.productForm.markAllAsTouched();

    if(this.productForm.invalid) return;

    const formValue = this.productForm.value;

    const formData: Partial<Product> = {
      ... formValue as any,
      //Convert in lowercase, split string by comma and trim blank spaces
      tags: formValue.tags?.toLowerCase().split(',').map((tag) => tag.trim()) ?? []
    };

    if(this.product().id == 'new') {
      this.productsService.createProduct(formData).subscribe({
        next: (product) => this.router.navigateByUrl('/admin/product/' + product.id),
        error: (error) => console.log(error),
        complete: () => this.launchToat("Product created successfully")
      });

    } else {
      this.productsService.updateProduct(this.product()?.id, formData).subscribe({
        next: () => this.launchToat("Product updated successfully"),
        error: (error) => console.log(error)
      });
    }

  }

  launchToat(msg:string) {
    this.toastMsg.set(msg);
    this.wasSaved.set(true);
    setTimeout(() =>{
      this.wasSaved.set(false);
      this.toastMsg.set('');
    }, 3000)
  }

}
