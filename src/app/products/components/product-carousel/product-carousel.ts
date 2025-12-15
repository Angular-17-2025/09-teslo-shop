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

    this.swiperInstance.destroy(true, true);

    //Clean the .swiper-pagination content
    const paginationElement: HTMLDivElement = this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');
    paginationElement.innerHTML = '';

    //Re-init Swiper
    setTimeout(() => {
      this.swiperInitFunc();
    }, 300)
  }

  ngAfterViewInit() {
    this.swiperInitFunc();
  }

  swiperInitFunc() {
    const swiper = this.swiperDiv().nativeElement;

    if(!swiper) return;

    this.swiperInstance = new Swiper(swiper, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [
        Navigation, Pagination
      ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

}
