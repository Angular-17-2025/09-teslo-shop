import { Component, ElementRef, input, ViewChild, effect, signal, inject, output } from '@angular/core';
import { Product } from '@products/interfaces/product-response-interface';
import { ProductImagePipe } from '@products/pipes/product-image-pipe';
import { RouterLink } from "@angular/router";
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ProductsService } from '@products/services/products-service';
import { Toast } from 'src/app/shared/components/toast/toast';

@Component({
  selector: 'app-products-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe, AsyncPipe, Toast],
  templateUrl: './products-table.html',
  styles: ``
})
export class ProductsTable {

  @ViewChild('deletModal') deletModal!: ElementRef<HTMLDialogElement>;

  products = input.required<Product[]>();
  product = signal<Product | null>(null);

  confirmDelete = signal<boolean>(false);

  toastType = signal<string | null>(null);
  toastMessage = signal<string | null>(null);

  private productService = inject(ProductsService);
  reloadProducts = output();

  deleteChanged = effect(() => {
    const confirmed = this.confirmDelete();
    const p = this.product();

    if (!confirmed || !p) return;

    this.productService.deleteProduct(this.product()!.id).subscribe({
      error: (error) => {
        console.log(error);
        this.toastType.set("error");
        this.toastMessage.set(error.message);

      }, complete: () => {
        this.toastType.set("success");
        this.toastMessage.set('The product was deleted successfully');
        this.reloadProducts.emit();
      }
    });
    this.closeDeleteModal();
  });

  ngAfterViewInit() {
    // If user closes with ESC, sync the signal back to null
    this.deletModal.nativeElement.addEventListener('close', () => {
      this.resetValues();
    });
  }

  openDeleteModal(product: Product) {
    this.deletModal?.nativeElement.showModal();
    this.product.set(product);
  }

  closeDeleteModal() {
    this.deletModal?.nativeElement.close();
    this.resetValues();
  }

  resetValues() {
    this.confirmDelete.set(false);
    this.product.set(null);
  }

}
