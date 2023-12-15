import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../shared/service/product.service";
import Swal from "sweetalert2";
import {PaymentService} from "../../../shared/service/payment.service";

@Component({
  selector: 'app-payment-request',
  templateUrl: './payment-request.component.html',
  styleUrls: ['./payment-request.component.scss']
})
export class PaymentRequestComponent implements OnInit {
  public isLoading = false;
  public isAdmin = true;
  public partnerBusinessName="";
  public partnerID;
  public isPartnerSelected;
  public isSuccess;

  partnerArray = [];
  recordList = [];

  constructor(private productService: ProductService, private paymentService: PaymentService) {
    this.getPartnerList();
  }

  getPartnerList(): void {

    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN' || sessionUser === 'ROLE_SUPER_ADMIN') {
      this.isAdmin=true;
      this.productService.getPartnerAll().subscribe(
        data => this.managePartnerDropDownList(data),
        error => this.partnerListError(error)
      );
    }else{
      this.partnerID = sessionStorage.getItem('partnerId');
      this.isAdmin=false;
      this.getWithdrawalsList(this.partnerID);
    }
  }

  managePartnerDropDownList(data) {
    this.partnerArray = [];
    const partnerCount = data.data.length;
    const partnerValue = data.data;
    for (let i = 0; i < partnerCount; i++) {
      const pr = {
        name: partnerValue[i].businessName,
        partner_name: partnerValue[i].partner_name,
        partner_u_id: partnerValue[i].partner_u_id
      };
      this.partnerArray.push(pr);
    }
  }

  partnerListError(error){
    Swal.fire(
      'Error',
      error.error.message_status,
      'error'
    );
  }

  getWithdrawalsList(partnerId) {
    this.recordList = [];
    if(this.isAdmin){
      var partnerName = document.getElementById('selectPartnersDropDown') as HTMLSelectElement;
      this.partnerBusinessName = partnerName.options[partnerName.selectedIndex].text;
    }

    this.isLoading=true;
    this.isPartnerSelected=true;

    let payload = {
      vendorCode: partnerId
    };

    this.paymentService.getVendorWiseWithdrawalsList(payload).subscribe(
      data => this.manageWithdrawalList(data),
      error => this.withdrawalListManagementError(error)
    );
  }

  manageWithdrawalList(response){
    this.isLoading=false;
    console.log('a');
    if(response.message==="Success"){
      this.isSuccess = true;
      this.recordList=[];
      this.recordList = response.data.map(item => {
        const pnrefArray = item.pnref.split(',');
        return {
          ...item,
          pnref: pnrefArray
        };
      });
    }else{
      this.isSuccess = false;
    }
  }
  withdrawalListManagementError(error){
    this.isLoading=false;
    Swal.fire(
      'Error',
      error.error.message_status,
      'error'
    );
  }

  ngOnInit(): void {
  }

}
