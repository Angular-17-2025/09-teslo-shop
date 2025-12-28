import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image-pipe';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-product-carousel',
  imports: [ProductImagePipe, AsyncPipe],
  templateUrl: './product-carousel.html',
  styles: `
    .swiper {
      width: 100%;
      height: 500px;
    }
  `
})
export class ProductCarousel implements AfterViewInit, OnChanges{

  title = input.required<string>();
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  swiperInstance: Swiper | undefined = undefined;

  ngOnChanges(changes: SimpleChanges): void {

    //If is the first change don't do anything
    if(changes['images'].firstChange) return;

    if(!this.swiperInstance) return;

    setTimeout(() => {
      this.swiperInstance?.update();
    }, 0)
  }

  ngAfterViewInit() {
    const el = this.swiperDiv().nativeElement;

    if(!el) return;

    this.swiperInstance = new Swiper(el, {
      // Optional parameters
      direction: 'horizontal',
      loop: false,
      modules: [ Navigation, Pagination ],
      pagination: { el: '.swiper-pagination' },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      scrollbar: { el: '.swiper-scrollbar' },
    });
  }

  goTo(moveTo: number) {
    // Wait for DOM render, then update swiper, then slide
    requestAnimationFrame(() => {
      this.swiperInstance?.update();

      const allIndexs = (this.swiperInstance?.slides?.length ?? 1) - 1;
      const indexMove = Math.max(0, Math.min(moveTo, allIndexs));
      this.swiperInstance?.slideTo(indexMove, 500);
    });
  }



}
