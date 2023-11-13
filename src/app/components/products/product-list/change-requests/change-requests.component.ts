import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../../shared/service/product.service";
import {Router} from "@angular/router";
import {environment} from "../../../../../environments/environment.prod";

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
  public paginatedPendingItems = [];
  public paginatedPendingQC = [];
  public isAdmin = false;
  public isPartner = false;
  public categoryUID = '';
  public qaTables = false;
  public EnablePriceEdit = false;
  public EnableStockEdit = false;

  public imagedefaultPathURI = '';
  imageUrl: any;

  page = 0;
  currentPageEditProApproval = 1; // Current page
  currentPageEditImgApproval = 1; // Current page
  totalPages = 0; // Total number of pages

  constructor(private productService: ProductService, private router: Router) {
    this.getFieldEditData();

  }

  ngOnInit(): void {
  }

  private getFieldEditData() {
    const role = sessionStorage.getItem('userRole');
    if (role === 'ROLE_PARTNER') {
      const payLoard = {
        user_u_id: sessionStorage.getItem('userId')
      };
    } else {
      this.productService.getEditFieldsDataAll().subscribe(
        data => this.manageFieldEditData(data),
      );
      this.productService.getnonActiveImageProduct().subscribe(
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
        catePath: data.data[i].catePath,
        action: ''

      };

      this.product_code = data.data[i].productCode;
      this.unique_code = data.data[i].editId;

      this.nonActiveEditedImagesArray.push(payloard);
    }
    console.log('img data!!!!!!!!!!')
    console.log(this.nonActiveEditedImagesArray)
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
      product.requestBy.toLowerCase().includes(searchTerm.toLowerCase()) || product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.totalPagesEditProApproval = Math.ceil(this.filterededitProductApproval.length / this.list_pages2);
    this.onPageChange(1,'EditProApproval');
  }

  editImgApprovalFilter(searchTerm: string): void {
    this.filterdEditImgApproval = this.nonActiveEditedImagesArray.filter(product =>
      product.requestBy.toLowerCase().includes(searchTerm.toLowerCase()) || product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.totalPagesEditImgApproval = Math.ceil(this.filterdEditImgApproval.length / this.list_pages2);
    this.onPageChange(1,'EditImgApproval');
  }

  // click events
  ApproveEditProduct(i) {

    if (this.filterededitProductApproval.length > 0) {
      const product_code = this.filterededitProductApproval[this.startIndex + i].productCode;
      const unique_code = this.filterededitProductApproval[this.startIndex + i].unique_code;
      const sub_type = this.filterededitProductApproval[this.startIndex + i].subType;
      const ProDetails = product_code + '-' + unique_code + '-' + sub_type;
      this.router.navigate(['products/digital/edited-approve-product/' + ProDetails]);
    } else {
      const product_code = this.nonActiveEditedProductsArray[this.startIndex + i].productCode;
      const unique_code = this.nonActiveEditedProductsArray[this.startIndex + i].unique_code;
      const sub_type = this.nonActiveEditedProductsArray[this.startIndex + i].subType;
      const ProDetails = product_code + '-' + unique_code + '-' + sub_type;
      this.router.navigate(['products/digital/edited-approve-product/' + ProDetails]);
    }
  }

  ApproveEditImageProduct(rowIndex) {
    if(this.filterdEditImgApproval.length > 0){
      const url = 'products/digital/edited-image-approve-product/' + this.filterdEditImgApproval[this.startIndex + rowIndex].productCode;
      this.router.navigate([url], {
        queryParams: {
          product_code: this.product_code,
          unique_code: this.filterdEditImgApproval[this.startIndex+rowIndex].editId,
          requested_by: this.filterdEditImgApproval[this.startIndex+rowIndex].requestBy
        }
      });
    }else{
      const url = 'products/digital/edited-image-approve-product/' + this.nonActiveEditedImagesArray[this.startIndex+rowIndex].productCode;
      this.router.navigate([url], {
        queryParams: {
          product_code: this.product_code,
          unique_code: this.nonActiveEditedImagesArray[this.startIndex+rowIndex].editId,
          requested_by: this.nonActiveEditedImagesArray[this.startIndex+rowIndex].requestBy
        }
      });
    }

  }
}
