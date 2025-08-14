import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styles: ``
})
export class Pagination {

  totalPages = input<number>(0);
  currentPage = input<number>(1);

  gatePageList = computed(() => {
    return Array.from( { length: this.totalPages() }, (_, index) => index + 1 );
  });

}
