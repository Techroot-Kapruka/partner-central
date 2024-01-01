import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../shared/service/product.service";
import Swal from "sweetalert2";
import {PaymentService} from "../../../shared/service/payment.service";
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import * as excel from 'xlsx';

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
  public selectedVendor:any;

  partnerArray = [];
  recordList = [];

  @ViewChild(DropdownComponent, { static: false }) dropdownComponent: DropdownComponent;
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
    let pr = {};
    const partnerCount = data.data.length;
    const partnerValue = data.data;
    this.partnerArray = [];
    for (let i = 0; i < partnerCount; i++) {
      pr = {
        label: partnerValue[i].businessName,
        value: partnerValue[i].partner_u_id
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
      const selectedItem = this.partnerArray.find(item => item.value === partnerId);
      if (selectedItem) {
        const selectedLabel = selectedItem.label;
        this.partnerBusinessName=selectedLabel;
      }
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
    this.selectedVendor = 'Select Vendor';
    if (this.dropdownComponent) {
      this.dropdownComponent.setDefaultValue();
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

  exportToVendorWList() {
    this.paymentService.getvendorWithdrawalDetails().subscribe(
      data => {
        this.GetvendorWithdrawalDetails(data);
      },
      error => {
        Swal.fire(
          'error',
          error.message,
          'error'
        );
      },
    );
  }

  private GetvendorWithdrawalDetails(data) {
    if (data.data !== null) {
      const AllData = [];

      for (let i = 0; i < data.data.length; i++) {

        const dateObj: Date = new Date(data.data[i].withdrawalDate);
        const year: number = dateObj.getFullYear();
        const month: number = dateObj.getMonth() + 1;
        const day: number = dateObj.getDate();

        AllData.push(
          [data.data[i].vendorCode,
            data.data[i].accountName,
            data.data[i].bankName,
            data.data[i].branchName,
            data.data[i].vendorAccountNo,
            data.data[i].transactionCode,
            data.data[i].withdrawalAmount,
            year,
            month,
            day,
            data.data[i].remark]
        );
      }

      // Create a worksheet
      const ws: excel.WorkSheet = excel.utils.aoa_to_sheet([['Referance No', 'Staff / Supplier Account Name', 'Bank Name',
        'Branch  Name', 'Staff / Supplier Credit Account No', 'Transaction Code', 'Amount   Rs. ', 'Value Date (YYYY)',
        'Value Date (MM)', 'Value Date (DD)', ' Remark '], ...AllData]);

      // Create a workbook with the worksheet
      const wb: excel.WorkBook = excel.utils.book_new();
      excel.utils.book_append_sheet(wb, ws, 'Bulk Payment Upload Report');

      // Save the workbook as an Excel file
      excel.writeFile(wb, 'Bulk Payment Upload Report.xlsx');
    } else {
      Swal.fire(
        'warning',
        'Records not found',
        'warning'
      );
    }
  }

}
