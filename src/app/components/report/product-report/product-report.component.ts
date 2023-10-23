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

  // Nimesha --- 25-08-2023  ---  Load ProductCode to Selected List ------------------------------------
  public productCode = '';
  public productDetailsArr2: any = [];
  public partnerArray = [];
  public categoryUID = "";
  searchData: any[] = [];
  searchText = '';
  selectedOption = '-- Select Vendor --';
  showDropdown = false;
  selectedData: any = null;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('listElement') listElement: ElementRef;

  // ---------------------------------------------------------------------------------------------------

  constructor(private productService: ProductService) {
    this.getAllProducts();
    this.getAllProductstoS();
    this.getPartner();
    this.loadData();
  }

  ngOnInit(): void {
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      data => this.LoadAllProduct(data),
    );
  }

  getAllProductstoS() {
    this.productService.getAllProducts().subscribe(res => {
      this.productDetailsArr2 = res.data;
    });
  }

  exportToExcel(): void {
    const element = document.getElementById('product-excel');
    const ws: excel.WorkSheet = excel.utils.table_to_sheet(element);


    // Set the width cols
    ws['!cols'] = [
      {width: 15},
      {width: 15},
      {width: 63},
      {width: 10},
      {width: 15},
      {width: 15},
    ];
    const wb: excel.WorkBook = excel.utils.book_new();
    excel.utils.book_append_sheet(wb, ws, 'product-Report');

    excel.writeFile(wb, 'product-report.xlsx');
  }

  // Nimesha --- 25-08-2023  ---  Load ProductCode to Selected List ------------------------------------
  selectProduct() {
    const ProID = (document.getElementById('select_proc') as HTMLInputElement).value;
    this.getPaginateOrderList(ProID);
  }

  // Load Product Details According to selected product code
  getPaginateOrderList(ProID) {
    const payloard = {
      product_code: ProID
    };
    this.productService.getSelecedProductByEdit(payloard).subscribe(
      data => this.manageLimitedProduct(data, ProID),
    );
  }

  manageLimitedProduct(data, ProID) {

    this.productDetailsArr = [];
    if (data.data.product) {
      const or = {
        product_code: data.data.product.product_code,
        category_code: data.data.product.category_code,
        title: data.data.product.title,
        brand: data.data.product.brand,
        manufacture: data.data.product.manufacture,
        vendor: data.data.product.vendor,
        in_stock: data.data.product.in_stock,
        seling_price: data.data.product.productVariation[0].selling_price,
      };
      this.productDetailsArr.push(or);
    }
  }

  LoadAllProduct(data) {
    this.productDetailsArr = [];
    for (let i = 0; i < data.data.length; i++) {
      const payData = {
        product_code: data.data[i].product_code,
        category_code: data.data[i].category_code,
        title: data.data[i].title,
        brand: data.data[i].brand,
        manufacture: data.data[i].manufacture,
        vendor: data.data[i].vendor,
        in_stock: data.data[i].in_stock,
        seling_price: data.data[i].productVariation[0].selling_price,
      };
      this.productDetailsArr.push(payData);
    }
  }

  // ** END ** - Nimesha --- 25-08-2023  ---  Load ProductCode to Selected List -------------------------

  getPartner(): void {
    this.productService.getPartnerAll().subscribe(res => {
      this.partnerArray = res.data;
    });
  }

  getSelectedPartnerProduct() {
    this.searchText = '';
    const name = (document.getElementById('select_vendor') as HTMLInputElement).value;
    this.productService.getProductByBussiness(name,this.categoryUID).subscribe(
      data => this.getSelectedProductManage(data),
    );
  }

  getSelectedProductManage(data) {
    this.productDetailsArr = [];

    if (data.data == null) {
    } else {
      const lengthRes = data.data.length;
      for (let i = 0; i < lengthRes; i++) {
        const or = {
          product_code: data.data[i].product_code,
          category_code: data.data[i].category_code,
          title: data.data[i].title,
          brand: data.data[i].brand,
          manufacture: data.data[i].manufacture,
          vendor: data.data[i].vendor,
          in_stock: data.data[i].in_stock,
          seling_price: data.data[i].selling_price,
        };
        this.productDetailsArr.push(or);
      }
    }
  }

  loadData(): void {
    this.productService.getAllProducts().subscribe(res => {
      this.searchData = res.data;
    });
  }

  filterData(): any[] {
    return this.searchData.filter(item =>
      item.product_code.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  showSuggestionBox() {
    this.showDropdown = true;
  }

  selectItem(item: any) {
    this.selectedOption = '-- Select Vendor --';
    this.selectedData = item;
    this.searchText = item.product_code; // Set selected item's name to the textbox
    this.showDropdown = false; // Hide the dropdown after selection
    this.getPaginateOrderList(item.product_code);
  }

  selectAllText() {
    this.searchInput.nativeElement.select();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    this.showDropdown = false;
  }
}
