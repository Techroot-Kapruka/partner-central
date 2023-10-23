import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductService} from "../../../shared/service/product.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-approve-edit-product',
  templateUrl: './approve-edit-product.component.html',
  styleUrls: ['./approve-edit-product.component.scss']
})
export class ApproveEditProductComponent implements OnInit {

  public ids = '';
  public productCode_ = '';
  public uniqueCode_ = '';
  public subType_ = '';
  public oldInputData = [];
  public newInputData = [];
  public proList = [];
  public requestedBy = '';
  constructor(private router: Router, private Activatedroute: ActivatedRoute, private modalService: NgbModal, private productService: ProductService) {
    this.ids = '';
    this.Activatedroute.paramMap.subscribe(params => {
      this.ids = params.get('id');
    });

    this.proList = this.ids.split('-');
    this.productCode_ = this.proList[0];
    this.uniqueCode_ = this.proList[1];
    this.subType_ = this.proList[2];

    this.getAllData();
  }

  ngOnInit(): void {
  }

  private getAllData() {
    let paloard = {
      referenceId : this.productCode_,
      unique_code : this.uniqueCode_,
      sub_type : this.subType_
    };

    this.productService.getEditFieldsDataAllForApproval(paloard).subscribe(
      data => this.manageGetEditFieldsDataAllForApproval(data),
    );
  }

  private manageGetEditFieldsDataAllForApproval(data) {
    (document.getElementById('productCode') as HTMLInputElement).value = this.productCode_;
    (document.getElementById('vendorName') as HTMLInputElement).value = data.data.vendorName;
    (document.getElementById('productName') as HTMLInputElement).value = data.data.productName;
    (document.getElementById('vendorId') as HTMLInputElement).value = data.data.vendor;
    this.newInputData = data.data.newArray;
    this.oldInputData = data.data.oldArray;
    this.requestedBy = data.data.vendor;
  }

  approvefield() {
    let payloads = {
      referenceId: this.productCode_,
      requestedBy: this.requestedBy,
      isApproved: 1,
      approvedUser: sessionStorage.getItem('userId'),
      unique_code : this.uniqueCode_
    };


   this.productService.approveFields(payloads).subscribe(
     data => this.manageApproveFields(data),
   );
  }

  rejectfield() {
    let payloads = {
      referenceId: this.productCode_,
      rejectedUser: this.requestedBy,
      unique_code : this.uniqueCode_
    };


    this.productService.rejectFields(payloads).subscribe(
      data => this.manageRejectFields(data),
    );
  }

  private manageApproveFields(data) {
    Swal.fire(
      'go ahead...!',
      data.message,
      'success'
    );
    this.router.navigate(['/products/digital/digital-product-list']).then( );
  }

  private manageRejectFields(data) {
    Swal.fire(
      'go ahead...!',
      data.message,
      'success'
    );
    this.router.navigate(['/products/digital/digital-product-list']).then( );
  }
}
