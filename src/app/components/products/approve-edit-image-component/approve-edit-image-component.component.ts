import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductService} from "../../../shared/service/product.service";
import {environment} from "../../../../environments/environment.prod";
import {FormControl, FormGroup} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-approve-edit-image-component',
  templateUrl: './approve-edit-image-component.component.html',
  styleUrls: ['./approve-edit-image-component.component.scss']
})
export class ApproveEditImageComponentComponent implements OnInit {

  public imageCliant: FormGroup;

  public ids = '';
  public productCode_ = '';
  public uniqueCode_ = '';
  public requestedBy = '';
  public requestedId = '';
  public edit: boolean = false;
  showButtons: boolean = false;
  public image1 = '';
  public image2 = '';
  public image3 = '';
  public image4 = '';
  public image5 = '';
  public imageData = [];
  public imagePathURI = environment.imageURIENVTemp;
  public imagePathURI2 = environment.imageURIENV;

  constructor(private router: Router, private Activatedroute: ActivatedRoute, private modalService: NgbModal, private productService: ProductService) {
    this.ids = '';
    this.Activatedroute.paramMap.subscribe(params => {
      this.ids = params.get('id');

    });
    this.Activatedroute.queryParams.subscribe(params => {
      this.productCode_ = params['product_code'];
      this.uniqueCode_ = params['unique_code'];
      this.requestedBy = params['requested_by']
      this.requestedId = params['requestedId']

    });
    this.getAllData();
  }

  ngOnInit(): void {

    if (sessionStorage.getItem('userRole') == 'ROLE_PARTNER'){
      this.showButtons = false;
    }else{
      this.showButtons = true;
    }
  }

  private getAllData() {
    let paloard = {
      editId: this.uniqueCode_,
      productCode: this.ids,
      requestedBy: this.requestedId,
    };

    this.productService.getEditFieldsImageDataAllForApproval(paloard).subscribe(
      data => this.manageGetEditImageFieldsDataAllForApproval(data),
    );


  }


  manageImageForEdit(data) {
    var imagePath = [];
    var removePathURI = '';

      for (let i = 0; i < data.data.image.length ; i++){
        if (this.uniqueCode_.startsWith('E')){
          this.edit = true;
          imagePath = data.data.image[i].split('/editimagetemp');
        }else if (this.uniqueCode_.startsWith('R')){
          this.edit = false;
          removePathURI = data.data.image[i].split('/');
          const lastPart = removePathURI[removePathURI.length - 1];
          imagePath[1] = '/' + this.requestedId.toLowerCase() + '/' + this.productCode_.replace("OD", "").toLowerCase() + '/' + lastPart;
        }

        this.imageData.push(imagePath[1] + '?' + new Date().getTime());
      }

  }

  private manageGetEditImageFieldsDataAllForApproval(data) {
    this.productCode_ = data.data.productCode;
    this.manageImageForEdit(data);

    (document.getElementById('productCode_') as HTMLInputElement).value = data.data.productCode;
    (document.getElementById('vendorName_') as HTMLInputElement).value = data.data.vendorName;
    (document.getElementById('productName_') as HTMLInputElement).value = data.data.productName;
    (document.getElementById('vendorId_') as HTMLInputElement).value = data.data.partnerId;
  }

  approvedProductsImages() {
    let payloads = {
      productCode: this.productCode_,
      isApproved: 1,
      approvedUser: sessionStorage.getItem('userId'),
      editId : this.uniqueCode_
    };
    this.productService.approveImageFields(payloads).subscribe(
      data => this.manageApproveFields(data)
    );
  }

  rejectProductsImages(){
    let payloads = {
      productCode: this.productCode_,
      rejectedBy: this.requestedBy,
      editId : this.uniqueCode_
    };
    this.productService.rejectImageFields(payloads).subscribe(
      data => this.manageRejectFields(data),
    );
  }
  private manageApproveFields(data) {
    Swal.fire(
      'Product Image has been Approved.!',
      data.message,
      'success'
    );
    this.router.navigate(['/products/digital/digital-product-list']).then();
  }
  private manageRejectFields(data) {
    Swal.fire(
      'Product Image has been Rejected.!',
      data.message,
      'success'
    );
    this.router.navigate(['/products/digital/digital-product-list']).then();
  }

}
