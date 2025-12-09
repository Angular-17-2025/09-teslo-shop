import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '@products/interfaces/product-response-interface';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/slug-pattern';

@Component({
  selector: 'app-product-form',
  imports: [ProductCarousel, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styles: ``
})
export class Productform  implements OnInit{

  product = input.required<Product>();
  formBuilder = inject(FormBuilder);

  sizesMap = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  productForm = this.formBuilder.group({
    title: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
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
    console.log(this.productForm.value);
  }

}
