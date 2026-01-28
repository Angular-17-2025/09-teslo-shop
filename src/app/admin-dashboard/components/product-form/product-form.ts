import { Component, computed, ElementRef, inject, input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Product } from '@products/interfaces/product-response-interface';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from 'src/app/shared/components/form-error-label/form-error-label';
import { ProductsService } from '@products/services/products-service';
import { Router, RouterLink } from "@angular/router";
import { Toast } from "src/app/shared/components/toast/toast";

@Component({
  selector: 'app-product-form',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel, RouterLink, Toast],
  templateUrl: './product-form.html',
  styles: ``
})
export class Productform  implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(ProductCarousel) carousel!: ProductCarousel;

  product = input.required<Product>();
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  productsService = inject(ProductsService);
  imagesFiles = signal<File[]>([]);
  tempImagesPreviews = signal<{url: string; file: File} []>([]);
  oldProductImages = signal<string[]>([]);
  productImages = computed(() => {
    return [...this.oldProductImages(), ...this.tempImagesPreviews().map(preview => preview.url)]
  });

  sizesMap = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  toastMessage = signal<string>("");
  toastType = signal<string>("");

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
    this.oldProductImages.set([...(this.product().images ?? [])]);
    this.setFormValues(this.product());
  }

  ngOnDestroy(): void {
    this.productForm.reset();
    this.product().title = "";
    this.product().id = "new";
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
      this.productsService.createProduct(formData, this.imagesFiles()).subscribe({
        next: (product) => {
          this.resetValues(product);
          this.product().id = product.id;
          this.router.navigateByUrl('/admin/product/' + product.id);
        },
        error: (error) => {
          console.log(error);
          this.toastMessage.set(error.message);
          this.toastType.set("error");
        },
        complete: () => {
          this.toastMessage.set("Product created successfully");
          this.toastType.set("success");
        }
      });

    } else {
      this.productsService.updateProduct(this.product()?.id, formData, this.imagesFiles(), this.oldProductImages()).subscribe({
        next: (productUpdated) => this.resetValues(productUpdated),
        error: (error) => {
          console.log(error);
          this.toastMessage.set(error.message);
          this.toastType.set("error");
        },
        complete: () => {
          this.toastMessage.set("Product updated successfully");
          this.toastType.set("success");
        }
      });
    }

  }

  resetValues(product: Product) {
    this.oldProductImages.set([...(product.images ?? [])]);
    this.product().title = product.title;
    this.imagesFiles.set([]);
    this.tempImagesPreviews.set([]);
    this.fileInput.nativeElement.value = '';
  }

  onImageInput(event: Event) {
    //Extract array of images Types as HTMLInputElement to access all properties
    const selectedFiles = Array.from((event.target as HTMLInputElement).files ?? []);

    //Build the tempImagesPreviews() structure
    const previews = selectedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    // Add the new values
    this.imagesFiles.set([...selectedFiles]);
    this.tempImagesPreviews.set([...previews]);

    // To see the first image added(When add several)
    const firstPreviewIndex = this.oldProductImages().length;

    // Wait a tick so @for renders the new slides, then move
    setTimeout(() => {
      this.carousel.goTo(firstPreviewIndex);
      // this.carousel.goTo(lastPreviewIndex);
    }, 0);
  }

  removeImage(imageRemoved: string) {
    // if it's an old image (already in DB)
    if (this.oldProductImages().includes(imageRemoved)) {
      this.oldProductImages.set(this.oldProductImages().filter(oldImage => oldImage !== imageRemoved));
      return;
    }

    // else it's a preview url => remove preview + its file
    const previews = this.tempImagesPreviews();
    const idx = previews.findIndex(preview => preview.url === imageRemoved);
    if (idx === -1) return;

    // revoke blob url to free memory
    URL.revokeObjectURL(previews[idx].url);

    const newPreviews = previews.filter((_, index) => index !== idx);
    this.tempImagesPreviews.set(newPreviews);

    // remove the matching file from imagesFiles as well
    const files = this.imagesFiles();
    const fileToRemove = previews[idx].file;
    this.imagesFiles.set(files.filter(file => file !== fileToRemove));
  }

  clearToast() {
    this.toastMessage.set("");
    this.toastType.set("");
  }

}
