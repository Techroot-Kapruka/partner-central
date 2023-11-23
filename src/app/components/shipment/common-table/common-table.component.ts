import {Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent implements OnChanges {

  @Input() tableData: any[] = [];
  @Input() columnArray: any[] = [];
  @Input() showActionButton = false;
  @Input() lengthOfArray = 0;
  @Output() onEdit = new EventEmitter<any>();

  public filteredProducts: any = [];
  public paginatedItems = [];
  public countForPage = 20;
  public page = 0;
  public currentPage = 1; // Current page
  public totalPages = 0; // Total number of pages
  public startIndex = 0; // Total number of pages
  public isSearchRecordEmpty = false;
  public isSearchRecordNotEmpty = false;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.isSearchRecordEmpty = false;
    this.isSearchRecordNotEmpty = true;

    this.startIndex = 0;
    this.paginatedItems = this.tableData;
    this.totalPages = Math.ceil(this.lengthOfArray / this.countForPage);
    this.onPageChange(1);
  }

  editRecord(item: any) {
    this.onEdit.emit(item.shipment_id);
  }

  ActiveProductFilter(searchTerm: string): void {
    this.filteredProducts = this.tableData.filter(shipment =>
      shipment.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (this.filteredProducts.length === 0) {
      this.totalPages = 0;
      this.onPageChange(0);
    } else {
      this.totalPages = Math.ceil(this.filteredProducts.length / this.countForPage);
      this.onPageChange(1);
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateTableData(page);
  }

  updateTableData(page: number) {
    const startIndex = (this.currentPage - 1) * this.countForPage;
    const endIndex = startIndex + this.countForPage;
    this.startIndex = startIndex;
    if (this.filteredProducts.length > 0) {
      this.isSearchRecordEmpty = false;
      this.isSearchRecordNotEmpty = true;
      this.paginatedItems = this.filteredProducts.slice(startIndex, endIndex);
    } else {
      if (page === 0) {
        this.isSearchRecordEmpty = true;
        this.isSearchRecordNotEmpty = false;
      } else {
        this.isSearchRecordEmpty = false;
        this.isSearchRecordNotEmpty = true;
        this.paginatedItems = this.tableData.slice(startIndex, endIndex);
      }
    }
  }
}
