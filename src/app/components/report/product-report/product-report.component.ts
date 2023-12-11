import {Component, ElementRef, OnInit, ViewChild, HostListener} from '@angular/core';
import {ProductService} from 'src/app/shared/service/product.service';
import * as excel from 'xlsx';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.scss']
})

export class ProductReportComponent implements OnInit {

  public productDetailsArr: any = [];
  public partnerArray = [];
  public isLoading = false;
  public noRecords = false;
  public productCode = '';
  public partnerId = '';
  public searchText = '';
  public selectedOption = '-- All Vendors --';
  totalPages = 0;
  countForPage = 100;
  page = 1;
  currentPage = 0;
  startIndex = 0;
  pageIndexes: Array<any> = [];

  constructor(private productService: ProductService) {

    this.isLoading = true;
    this.getPartner();
    this.getAllProducts(this.page - 1, this.partnerId);
  }

  ngOnInit(): void {
  }

  getPartner(): void {
    this.productService.getPartnerAll().subscribe(res => {
      this.partnerArray = res.data;
    });
  }

  getSelectedPartnerProduct() {
    this.searchText = '';
    this.isLoading = true;
    const partnerID = (document.getElementById('select_vendor') as HTMLInputElement).value;
    this.getAllProducts(0, partnerID);
  }

  getAllProducts(page, partnerID) {
    this.productService.getAllProducts(page, partnerID, this.countForPage).subscribe(
      data => this.LoadAllProduct(data),
    );
  }

  LoadAllProduct(data) {
    this.isLoading = false;
    this.productDetailsArr = [];
    if (Object.keys(data.data).length !== 0) {
      this.noRecords = false;
      for (let i = 0; i < data.data.content.length; i++) {
        const payData = {
          product_code: data.data.content[i].product_code,
          category_code: data.data.content[i].category_code,
          title: data.data.content[i].title,
          brand: data.data.content[i].brand,
          manufacture: data.data.content[i].manufacture,
          vendor: data.data.content[i].vendor,
          in_stock: data.data.content[i].in_stock,
          seling_price: data.data.content[i].productVariation[0].selling_price,
          cost_price: data.data.content[i].productVariation[0].cost_price,
        };
        this.productDetailsArr.push(payData);
      }
    } else {
      this.noRecords = true;
    }

    this.totalPages = Math.ceil(data.data.totalElements / this.countForPage);
    this.currentPage = this.page;
  }

  getSelectedRow(page: number) {
    this.currentPage = page;
    this.page = page;

    this.isLoading = true;
    const partnerID = (document.getElementById('select_vendor') as HTMLInputElement).value;
    this.getAllProducts(page - 1, partnerID);
  }

  exportToExcel(): void {
    const AllData = [];
    this.productDetailsArr.forEach(product => {
      AllData.push([product.product_code, product.category_code, product.title, product.vendor, product.in_stock, product.seling_price, product.cost_price]);
    });

    // Create a worksheet
    const ws: excel.WorkSheet = excel.utils.aoa_to_sheet([['Product Code', 'Category Code', 'Title', 'Vendor', 'Stock Quantity', 'Selling Price', 'Cost Price'], ...AllData]);

    // Create a workbook with the worksheet
    const wb: excel.WorkBook = excel.utils.book_new();
    excel.utils.book_append_sheet(wb, ws, 'Product-Report');

    // Save the workbook as an Excel file
    excel.writeFile(wb, 'Shipment-report.xlsx');
  }
}
