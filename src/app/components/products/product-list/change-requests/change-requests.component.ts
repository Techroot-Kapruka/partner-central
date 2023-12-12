import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../../shared/service/product.service";
import {Router} from "@angular/router";
import {environment} from "../../../../../environments/environment.prod";
import {NgbTabChangeEvent} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-change-requests',
  templateUrl: './change-requests.component.html',
  styleUrls: ['./change-requests.component.scss']
})
export class ChangeRequestsComponent implements OnInit {

  nonActiveEditedProductsArray = [];
  nonActiveEditedImagesArray = [];
  paginatedEditProApproval = [];
  paginatedEditImgApproval = [];
  filterededitProductApproval = [];
  filterdEditImgApproval = [];

  product_code = '';
  unique_code = '';
  sub_type = '';
  public startIndex;

  totalPagesEditProApproval = 0;
  totalPagesEditImgApproval = 0;

  public list_pages2 = 20;
  public imagePathURI = environment.imageURIENV;

  public selected = [];
  public product = [];
  public isAdmin = false;
  public isPartner = false;
  public editTab = false;
  public emptyTableImg = false;
  public emptyTableProducts = false;

  public imagedefaultPathURI = '';
  imageUrl: any;

  page = 0;
  currentPageEditProApproval = 1; // Current page
  currentPageEditImgApproval = 1; // Current page
  totalPages = 0; // Total number of pages

  public headEditProduct = [];
  public headEditImg = [];
  constructor(private productService: ProductService, private router: Router) {
    this.getFieldEditData();

  }

  ngOnInit(): void {
  }

  private getFieldEditData() {
    const role = sessionStorage.getItem('userRole');
    const userID = sessionStorage.getItem('userId');
    if (role === 'ROLE_PARTNER') {
      const payLoard = {
        user_u_id: sessionStorage.getItem('userId')
      };
    } else {
      this.productService.getEditFieldsDataAll(role, userID).subscribe(
        data => this.manageFieldEditData(data),
      );
      this.productService.getnonActiveImageProduct(role, userID).subscribe(
        data => this.manageFieldImageEditData(data),
      );
    }
  }

  private manageFieldEditData(data) {
    this.product_code = '';
    this.sub_type = '';
    this.unique_code = '';
    for (let i = 0; i < data.data.length; i++) {

      const payloard = {
        productCode: data.data[i].referenceId,
        requestBy: data.data[i].requestedVendorName,
        requestedDate: data.data[i].requestedDate,
        subType: data.data[i].sub_type,
        type: data.data[i].type,
        title: data.data[i].productName,
        action: '',
        unique_code: data.data[i].unique_code,
        categoryPath: data.data[i].categoryPath,
        image: data.data[i].image.split('/product')[1],
      };
      this.nonActiveEditedProductsArray.push(payloard);
    }
    this.editTab = true;
    this.headEditProduct=[
      {'Head': 'Image', 'FieldName' : 'image' },
      {'Head': 'Title',  'FieldName' : 'title' },
      {'Head': 'Requested Date', 'FieldName':'in_stock' },
      {'Head': 'Requested By', 'FieldName':'createDate' },
      {'Head': 'Action',  'FieldName':'' },
    ]
    this.totalPagesEditProApproval = Math.ceil(this.nonActiveEditedProductsArray.length / this.list_pages2);
    this.onPageChange(1,'EditProApproval');
  }

  private manageFieldImageEditData(data) {
    for (let i = 0; i < data.data.length; i++) {

      const payloard = {
        productCode: data.data[i].productCode,
        requestBy: data.data[i].vendorName,
        editId: data.data[i].editId,
        requestedDate: data.data[i].requestedDate,
        title: data.data[i].title,
        categoryPath: data.data[i].catePath,
        type: data.data[i].editId,
        requestedId: data.data[i].requestedBy,
        action: '',
        image: data.data[i].image1.split('/product')[1],

      };
      this.product_code = data.data[i].productCode;
      this.unique_code = data.data[i].editId;

      this.nonActiveEditedImagesArray.push(payloard);
    }
    this.totalPagesEditImgApproval = Math.ceil(this.nonActiveEditedImagesArray.length / this.list_pages2);
    this.onPageChange(1,'EditImgApproval');
  }

  onPageChange(page: number, Descrip: string) {
    if (Descrip === 'EditProApproval' ){
      this.currentPageEditProApproval = page;
    }else if (Descrip === 'EditImgApproval'){
      this.currentPageEditImgApproval = page;
    }
    this.updateTableData(Descrip);
  }

  updateTableData(Descrip: string) {
    if (Descrip === 'EditProApproval'){
      const startIndex = (this.currentPageEditProApproval - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex;

      if(this.filterededitProductApproval.length > 0){
        this.paginatedEditProApproval = this.filterededitProductApproval.slice(startIndex, endIndex);
      }else{
        this.paginatedEditProApproval = this.nonActiveEditedProductsArray.slice(startIndex, endIndex);
      }
    }else if (Descrip === 'EditImgApproval'){
      const startIndex = (this.currentPageEditImgApproval - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex;

      if(this.filterdEditImgApproval.length > 0){
        this.paginatedEditImgApproval = this.filterdEditImgApproval.slice(startIndex, endIndex);
      }else{
        this.paginatedEditImgApproval = this.nonActiveEditedImagesArray.slice(startIndex, endIndex);
      }

    }
  }

  onImageError(event: any): void {
    this.imagedefaultPathURI = this.imagePathURI.replace('/product', '');
    event.target.src = this.imagedefaultPathURI + '/1.jpg';
  }

  // search Filters
  editProductApprovalFilter(searchTerm: string): void {
    this.filterededitProductApproval = this.nonActiveEditedProductsArray.filter(product =>
      product.requestBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryPath.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.totalPagesEditProApproval = Math.ceil(this.filterededitProductApproval.length / this.list_pages2);
    this.onPageChange(1,'EditProApproval');


    if (this.filterededitProductApproval.length == 0) {
      this.emptyTableProducts = true;
    } else {
      this.emptyTableProducts = false;
    }
  }

  editImgApprovalFilter(searchTerm: string): void {
    this.filterdEditImgApproval = this.nonActiveEditedImagesArray.filter(product =>
        product.requestBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryPath.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (this.filterdEditImgApproval.length == 0) {
      this.emptyTableImg = true;
    } else {
      this.emptyTableImg = false;
    }

    this.totalPagesEditImgApproval = Math.ceil(this.filterdEditImgApproval.length / this.list_pages2);
    this.onPageChange(1,'EditImgApproval');
  }

  // click events
  ApproveEditProduct(event) {
      const product_code = event.productCode;
      const unique_code = event.unique_code;
      const sub_type = event.subType;
      const ProDetails = product_code + '-' + unique_code + '-' + sub_type;
      // this.router.navigate(['products/digital/edited-approve-product/' + ProDetails]);

      const url = '#/products/digital/edited-approve-product/' + ProDetails;
      window.open(url, '_blank');
  }

  ApproveEditImageProduct(event) {
    const url = '#/products/digital/edited-image-approve-product/' + event.productCode;
    const queryParams = {
      product_code: event.productCode,
      unique_code: event.editId,
      requested_by: event.requestBy,
      requestedId: event.requestedId
    };

    // Convert the queryParams object to a query string
    const queryString = Object.keys(queryParams)
      .map(key => `${key}=${queryParams[key]}`)
      .join('&');

    // Append the query string to the URL
    const finalUrl = url + '?' + queryString;

    // Open the URL in a new tab
    window.open(finalUrl, '_blank');
  }

  onTabSelect(event: NgbTabChangeEvent) {
    const tabId = event.nextId;
    switch (tabId) {
      case 'ngb-tab-0':
        // edit products
        this.emptyTableImg = false;
        break;
      case 'ngb-tab-1':
        // edit imgs
        this.emptyTableProducts = false;
        break;
      default:
        this.emptyTableImg = false;
        this.emptyTableProducts = false;
    }
  }

  editTabCount(x){
    let count;
    switch (x) {
      case 1:
        count = this.nonActiveEditedProductsArray.length;
        return `Edit Product Approval (${count})`;
        break;
      case 2:
        count = this.nonActiveEditedImagesArray.length;
        return `Edit Image Approval (${count})`;
        break;
      default:
        console.log('Unknown');
    }
  }
}
