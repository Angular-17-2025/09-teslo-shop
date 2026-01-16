import { Component, computed, ElementRef, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { Product } from '@products/interfaces/product-response-interface';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from 'src/app/shared/components/form-error-label/form-error-label';
import { ProductsService } from '@products/services/products-service';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-form',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel, RouterLink],
  templateUrl: './product-form.html',
  styles: ``
})
export class Productform  implements OnInit{

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(ProductCarousel) carousel!: ProductCarousel;

  product = input.required<Product>();
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  productsService = inject(ProductsService);
  wasSaved = signal<boolean>(false);
  toastMsg = signal<string>("");
  imagesFiles: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);
  oldProductImages = signal<string[]>([]);
  productImages = computed(() => {
    return [...this.oldProductImages(), ...this.tempImages()]
  });

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
    this.oldProductImages.set([...(this.product().images ?? [])]);
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
        complete: () => this.launchToast("Product created successfully")
      });

    } else {
      this.productsService.updateProduct(this.product()?.id, formData, this.imagesFiles != undefined ? this.imagesFiles : [] as any, this.oldProductImages()).subscribe({
        next: (productUpdated) => {
          this.oldProductImages.set([...(productUpdated.images ?? [])]);
          this.product().title = productUpdated.title;
          this.imagesFiles = undefined;
          this.tempImages.set([]);
          this.fileInput.nativeElement.value = '';
        },
        error: (error) => console.log(error),
        complete: () => this.launchToast("Product updated successfully")
      });
    }

  }

  onImageInput(event: Event) {
    //Extract array of images Types as HTMLInputElement to access all properties
    const imagesSelected = (event.target as HTMLInputElement).files;

    this.imagesFiles = imagesSelected ?? undefined;

    // Convert each image in a URL to display in HTLM code
    this.tempImages.set(Array.from(imagesSelected ?? []).map((imageSelected) =>
      URL.createObjectURL(imageSelected)
    ));

    // To see the first image added(When add several)
    const firstPreviewIndex = this.oldProductImages().length;
    // To see the last image added(When add several)
    const lastPreviewIndex = this.oldProductImages().length + this.tempImages().length - 1;
    // Wait a tick so @for renders the new slides, then move
    setTimeout(() => {
      this.carousel.goTo(firstPreviewIndex);
      // this.carousel.goTo(lastPreviewIndex);
    }, 0);

  }

  launchToast(msg:string) {
    this.toastMsg.set(msg);
    this.wasSaved.set(true);
    setTimeout(() =>{
      this.wasSaved.set(false);
      this.toastMsg.set('');
    }, 3000)
  }

  removeImage(imageRemoved: string) {
    const oldImages = this.oldProductImages();
    const imageToRemove = oldImages.indexOf(imageRemoved);
    oldImages.splice(imageToRemove, 1);
    this.oldProductImages.set([...oldImages]);
  }

}
