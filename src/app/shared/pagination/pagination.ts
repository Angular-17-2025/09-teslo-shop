import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
  styles: ``
})
export class Pagination {

  totalPages = input<number>(0);
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);

  gatePageList = computed(() => {
    return Array.from( { length: this.totalPages() }, (_, index) => index + 1 );
  });

}
