import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../../shared/service/product.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  public productSearchList = [];
  searchValue: string = '';
  public searchText: string;
  isTableVisible: boolean = false;
  public startIndex;

  constructor(private productService: ProductService, private router: Router) {
  }

  ngOnInit(): void {
    // this.getProductSearchList();
  }

  onSearch(inputValue: string) {
    this.searchText = inputValue;
    this.getProductSearchList();
    if(this.searchText === ''){
      this.isTableVisible = false;
    }else {
      this.isTableVisible = true;
    }
  }
  getProductSearchList() {
    const object = {
      vendor_code: sessionStorage.getItem('partnerId'),
      userRole : sessionStorage.getItem('userRole')
    };
    this.productService.productSearchWithContext(this.searchText,object).subscribe(
      data => this.manageGetProductSearchList(data)
    );
  }

  manageGetProductSearchList(data) {
    this.startIndex = 0;
    this.productSearchList = [];
    for (let i = 0; i < data.data.length; i++) {
      const response = {
        productCode: data.data[i].productCode,
        productName: data.data[i].productName,
        description: data.data[i].description,
        categoryPath: data.data[i].categoryPath,
        vendor: data.data[i].vendor,
        sellingPrice: data.data[i].sellingPrice
      };
      this.productSearchList.push(response);
    }
  }

  loadPage(index: number) {
    window.open('https://www.kapruka.com/buyonline/' + this.productSearchList[this.startIndex + index].productName.replace(/\s+/g, '-').toLowerCase() + '/kid/' + 'ef_pc_' + this.productSearchList[this.startIndex + index].productCode, '_blank');
  }
}
