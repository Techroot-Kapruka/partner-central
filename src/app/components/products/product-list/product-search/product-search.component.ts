import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProductService} from '../../../../shared/service/product.service';
import {Router} from '@angular/router';
import {environment} from '../../../../../environments/environment.prod';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  public imagePathURI = environment.imageURIENV;
  public productSearchList = [];
  searchValue: string = '';
  public searchText: string;
  isTableVisible: boolean = false;
  isViewFormVisible: boolean = false;
  isValue: boolean = false;
  editOption: boolean = false;
  public startIndex;

  isDivVisible: boolean = false;
  public elementTitle: any;
  public elementProductCode: any;
  public elementItemGroup: any;
  public elementCategoryPath: any;
  public elementCreateDateTime: any;
  public elementCategoryName: any;
  public elementVendor: any;
  public elementStatus: any;
  public elementVendorCode: any;
  public elementDescription: any;
  public elementAvailableStock: any;
  public elementImage: any;
  public elementHistory: SafeHtml;
  public elementVariations = [];
  public elementVariationsTheme = [];
  public imageDefaultPathURI = '';


  isButtonClick: boolean = true;
  public badge: any;

  constructor(private productService: ProductService, private router: Router, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
  }


  onSearch(inputValue: string) {
    this.searchText = inputValue;
    this.getProductSearchList();
    if (this.searchText === '') {
      this.isTableVisible = false;
      this.isViewFormVisible = false;
    } else {
      this.isTableVisible = true;
      this.isViewFormVisible = false;
    }
  }

  getProductSearchList() {
    const object = {
      vendor_code: sessionStorage.getItem('partnerId'),
      userRole: sessionStorage.getItem('userRole')
    };
    this.isButtonClick = false;
    this.productService.productSearchWithContext(this.searchText, object).subscribe(
      data => this.manageGetProductSearchList(data),
      error => this.errorManage(error)
    );
  }

  manageGetProductSearchList(data) {
    if (data.data === null) {
      this.isButtonClick = true;
    }
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
    this.isButtonClick = true;
  }

  private errorManage(error: any) {
    console.log(error);
    // if (error.status === 401) {
    this.isButtonClick = true;
    // }
  }


  loadPage(index: number) {
    window.open('https://www.kapruka.com/buyonline/' + this.productSearchList[this.startIndex + index].productName.replace(/\s+/g, '-').toLowerCase() + '/kid/' + 'ef_pc_' + this.productSearchList[this.startIndex + index].productCode, '_blank');
  }

//   ----------------------------------------------------------------- Product View Show ---------------------------------------------------------//
  showDiv(productCode: string, vendor: string) {
    this.elementVariationsTheme = [];
    this.isDivVisible = true;
    this.isViewFormVisible = true;
    const object = {
      product_code: productCode
    };
    this.productService.getSelecedProductByEdit(object).subscribe(
      data => this.manageGetProductDetailsByCode(data, productCode, vendor)
    );
  }

  manageGetProductDetailsByCode(data: any, id, vendor) {
    this.elementTitle = data.data.product.title;
    this.elementProductCode = data.data.product.product_code;
    this.elementItemGroup = data.data.product.item_group;
    this.elementCategoryPath = data.data.category_path;
    this.elementVendor = vendor;
    this.elementCreateDateTime = data.data.product.create_date_time;
    this.elementCategoryName = data.data.product.categoryName;
    this.elementVendorCode = data.data.product.vendor;
    this.elementDescription = data.data.product.productDescription.description;
    this.elementAvailableStock = data.data.product.in_stock;
    this.elementImage = (data.data.product.productImage.image1 && data.data.product.productImage.image1 ? data.data.product.productImage.image1.split('/product')[1] : '') || '';
    // if (data.data.product.is_active === 0) {
    //   this.elementStatus = 'Available'
    //   this.badge = 'badge-success'
    // }else {
    //   this.elementStatus = 'Out of Stock'
    //   this.badge = 'badge-danger'
    // }
    switch (data.data.product.is_active) {
      case 1:
        this.elementStatus = 'Available';
        this.badge = 'badge-success';
        this.editOption = false;
        break;
      case -101:
        this.elementStatus = 'Suspended';
        this.badge = 'badge-danger';
        this.editOption = true;
        break;
      case -102:
        this.elementStatus = 'Suspended';
        this.badge = 'badge-danger';
        this.editOption = true;
        break;
      case -5:
        this.elementStatus = 'Out of Stock';
        this.badge = 'badge-warning';
        this.editOption = false;
        break;
      case -20:
        this.elementStatus = 'QA Approved';
        this.badge = 'badge-info';
        this.editOption = true;
        break;
      default:
        this.elementStatus = '';
        this.badge = 'badge';
        this.editOption = true;
    }

    // this.elementHistory = 'Exotic Perfumes & Cosmetics - Create Product - Sat Nov 11 12:14:29 IST 2023 <hr size=1>'
    this.elementHistory = this.sanitizer.bypassSecurityTrustHtml(data.data.product.productHistory);
    this.elementVariations = [];
    for (let i = 0; i < data.data.product.productVariation.length; i++) {
      this.elementVariationsTheme = [];
      for (let j = 0; j < data.data.product.productVariation[i].variations.length; j++) {
        const theme = {
          theme: data.data.product.productVariation[i].variations[j].theame,
          value: data.data.product.productVariation[i].variations[j].theame_value
        };
        this.elementVariationsTheme.push(theme);
      }

      const res = {
        cost_price: data.data.product.productVariation[i].cost_price,
        variation_code: data.data.product.productVariation[i].variation_code,
        selling_price: data.data.product.productVariation[i].selling_price,
        value: this.elementVariationsTheme,
      };
      this.elementVariations.push(res);
    }
    if (this.elementVariationsTheme[0].value == 'none') {
      this.isValue = true;
    } else {
      this.isValue = false;
    }
  }

  onEditClick(elementProductCode) {
    const url = '#/products/digital/digital-edit-product/' + elementProductCode;
    window.open(url, '_blank');
  }

  getStyle(value: string): any {
    if (this.isColorCode(value)) {
      return {'background': value, 'width': '60px'};
    } else {
      return {};
    }
  }

  isColorCode(value: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(value);
  }

  onImageError(event: any): void {
    this.imageDefaultPathURI = this.imagePathURI.replace('/product', '');
    event.target.src = this.imageDefaultPathURI + '/1.jpg';
  }

}
