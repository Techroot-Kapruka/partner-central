import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[appPagination]',
  exportAs: 'paginationmodel',
})
export class PaginationDirective {
  @Input()
  totalPage: number;
  pageNo: number = 1;

  constructor() {
  }

  onNext() {
    this.setPage(Math.min(this.totalPage, this.pageNo + 1));
  }

  setPage(pageNo) {
    this.pageNo = pageNo;
  }
}
