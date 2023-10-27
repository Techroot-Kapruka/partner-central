import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number;
  @Input() totalPages: number;
  @Output() pageChange = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  get pages(): number[] {
    const maxPages = 5;
    const totalPages = this.totalPages;

    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const currentPage = this.currentPage;
      const halfMaxPages = Math.floor(maxPages / 2);
      const firstPage = Math.max(1, currentPage - halfMaxPages);
      const lastPage = Math.min(totalPages, currentPage + halfMaxPages);
      return Array.from({ length: lastPage - firstPage + 1 }, (_, i) => firstPage + i);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
