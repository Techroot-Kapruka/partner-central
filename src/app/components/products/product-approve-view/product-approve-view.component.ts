import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductService} from "../../../shared/service/product.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {environment} from "../../../../environments/environment.prod";
import Swal from "sweetalert2";

@Component({
  selector: 'app-product-approve-view',
  templateUrl: './product-approve-view.component.html',
  styleUrls: ['./product-approve-view.component.scss']
})
export class ProductApproveViewComponent implements OnInit {
  public imagePathURI = environment.imageURIENV
  public ids = '';
  public elementTitle: any;
  public elementProductCode: any;
  public elementItemGroup: any;
  public elementCategoryPath: any;
  public elementCreateDateTime: any;
  public elementCategoryName: any;
  public elementVendor: any;
  public elementVendorCode: any;
  public elementDescription: SafeHtml;
  public elementImage1: any;
  public elementImage2: any;
  public elementImage3: any;
  public elementImage4: any;
  public elementImage5: any;
  public elementVariations = [];
  public elementVariationsTheme = [];
  public imageDefaultPathURI = '';
  isValue: boolean = false;
  attributeIsVisible: boolean = false;
  imageUrl: any;
  modalRef: any;
  approveButtonClicked = false;
  selectedValue = 'consignment';
  attributrHashMap: { [key: string]: any } = {}
  displayedRowCount = 5;

  @ViewChild('imagePopup') imagePopup: ElementRef;

  constructor(private router: Router, private _Activatedroute: ActivatedRoute, private modal: NgbModal, private productService: ProductService, private sanitizer: DomSanitizer) {
    this.ids = '';
    this._Activatedroute.paramMap.subscribe(params => {
      this.getApproveProduct(params.get('id'));
      this.ids = params.get('id');
    });
  }

  ngOnInit(): void {
  }

  private getApproveProduct(id: string) {
    let payloard = {
      product_code: id
    };
    this.productService.getSelecedProductByEdit(payloard).subscribe(
      data => this.manageGetProductDetailsByCode(data, id)
    );
  }

  private manageGetProductDetailsByCode(data: any, productCode: string) {
    if (data.data.attributeList !== '{}') {
      this.attributeIsVisible = true
      const json = JSON.parse(data.data.attributeList);
      for (const key of Object.keys(json)) {
        this.attributrHashMap[key] = json[key];
      }
      for (const key in this.attributrHashMap) {
        if (this.attributrHashMap.hasOwnProperty(key)) {
          console.log(`Key: ${key} Value: ${this.attributrHashMap[key]}`);
        }
      }
    }else {
      this.attributeIsVisible = false
    }

    this.elementTitle = data.data.product.title
    this.elementProductCode = productCode
    this.elementItemGroup = data.data.product.item_group
    this.elementCategoryPath = data.data.category_path
    this.elementVendor = data.data.product.vendorName
    this.elementCreateDateTime = data.data.product.create_date_time
    this.elementCategoryName = data.data.product.categoryName
    this.elementVendorCode = data.data.product.vendor
    this.elementDescription = this.sanitizer.bypassSecurityTrustHtml(data.data.product.productDescription.description);
    this.elementImage1 = (data.data.product.productImage.image1 && data.data.product.productImage.image1 ? data.data.product.productImage.image1.split('/product')[1] : '') || ''
    this.elementImage2 = (data.data.product.productImage.image2 && data.data.product.productImage.image2 ? data.data.product.productImage.image2.split('/product')[1] : '') || ''
    this.elementImage3 = (data.data.product.productImage.image3 && data.data.product.productImage.image3 ? data.data.product.productImage.image3.split('/product')[1] : '') || ''
    this.elementImage4 = (data.data.product.productImage.image4 && data.data.product.productImage.image4 ? data.data.product.productImage.image4.split('/product')[1] : '') || ''
    this.elementImage5 = (data.data.product.productImage.image5 && data.data.product.productImage.image5 ? data.data.product.productImage.image5.split('/product')[1] : '') || ''

    this.elementVariations = [];
    for (let i = 0; i < data.data.product.productVariation.length; i++) {
      this.elementVariationsTheme = [];
      for (let j = 0; j < data.data.product.productVariation[i].variations.length; j++) {
        const theme = {
          theme: data.data.product.productVariation[i].variations[j].theame,
          value: data.data.product.productVariation[i].variations[j].theame_value
        }
        this.elementVariationsTheme.push(theme);
      }

      const res = {
        cost_price: data.data.product.productVariation[i].cost_price,
        variation_code: data.data.product.productVariation[i].variation_code,
        selling_price: data.data.product.productVariation[i].selling_price,
        changing_rate: data.data.product.productVariation[i].changing_rate,
        value: this.elementVariationsTheme,
      }
      this.elementVariations.push(res);
    }
    if (this.elementVariationsTheme[0].value == 'none') {
      this.isValue = true;
    } else {
      this.isValue = false;
    }
  }

  isColorCode(value: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(value);
  }

  onImageError(event: any): void {
    this.imageDefaultPathURI = this.imagePathURI.replace('/product', '');
    event.target.src = this.imageDefaultPathURI + '/1.jpg';
  }

  getStyle(value: string): any {
    if (this.isColorCode(value)) {
      return {'background': value, 'width': '60px'};
    } else {
      return {};
    }
  }
  closePopup() {
    this.modalRef.close();
    this.imageUrl = undefined;
  }


  popUpImageActive(number: number) {
    if(number === 1) {
      this.imageUrl = this.imagePathURI + this.elementImage1;
    }else if (number === 2){
      this.imageUrl = this.imagePathURI + this.elementImage2;
    }else if (number === 3){
      this.imageUrl = this.imagePathURI + this.elementImage3;
    }else if (number === 4){
      this.imageUrl = this.imagePathURI + this.elementImage4;
    }else if (number === 5){
      this.imageUrl = this.imagePathURI + this.elementImage5;
    }

    this.modalRef = this.modal.open(this.imagePopup, {centered: true});
  }

  onRadioChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedValue = target.value;
    }
  }

  approveProduct() {
    this.approveButtonClicked = true;
    let payloard = {
      product_code: this.ids,
      approved_user_id: sessionStorage.getItem('userId'),
      supply: this.selectedValue
    };
    this.productService.ApproveProduct(payloard).subscribe(
      data => this.manageApproveProduct(data),
      error => this.errorOrderManage(error)
    );
  }
  manageApproveProduct(data) {
    Swal.fire(
      'Good job!',
      data.message,
      'success'
    );
    let url = 'products/digital/digital-product-list';
    this.router.navigate([url]);
  }
  errorOrderManage(err) {
  }
  goToDeclinedMessageFormForProduct() {
    const productCode = 'Product-' + this.ids;
    this.router.navigate(['/declined-message/' + productCode]);
  }

  getAttributeKeys(): string[] {
    return Object.keys(this.attributrHashMap).slice(0, this.displayedRowCount);
  }

  loadMore() {
    this.displayedRowCount += 5; // Increase the displayed row count
  }
}
