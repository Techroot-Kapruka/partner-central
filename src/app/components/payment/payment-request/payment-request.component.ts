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
  public isAdmin = false;
  public partnerBusinessName="";
  public partnerID;
  public isPartnerSelected;
  public isSuccess;
  public selectedVendor:any;
  public totalPriceCounter=0;
  public checkedPriceCount= 0;
  sessionUser;
  lastSelectedVendor;

  partnerArray = [];
  recordList = [];

  @ViewChild(DropdownComponent, { static: false }) dropdownComponent: DropdownComponent;
  constructor(private productService: ProductService, private paymentService: PaymentService) {
    this.sessionUser = sessionStorage.getItem('userRole');
    this.getPartnerList();
    if (this.sessionUser === 'ROLE_ADMIN' || this.sessionUser === 'ROLE_SUPER_ADMIN') {
      this.getWithdrawalsList("*");
      this.isAdmin=true;
    }
  }

  getPartnerList(): void {
    if (this.sessionUser === 'ROLE_ADMIN' || this.sessionUser === 'ROLE_SUPER_ADMIN') {
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
    let selectAllPartnersOption = {
      label: "Select All",
      value: "*"
    }
    this.partnerArray.push(selectAllPartnersOption);
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
      if(partnerId==="*"){
        const obj = {
          label:"Select All",
          value:"*"
        }
        this.lastSelectedVendor=obj;
      }else{
        this.lastSelectedVendor = this.partnerArray.find(item => item.value === partnerId);
      }

      if (this.lastSelectedVendor) {
        const selectedLabel = this.lastSelectedVendor.label;
        if(this.lastSelectedVendor.value=="*"){
          this.partnerBusinessName="";
        }else{
          this.partnerBusinessName=selectedLabel;
        }
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
    this.totalPriceCounter=0;
    this.checkedPriceCount=0;
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
      for(let i =0;i<this.recordList.length;i++){
        this.totalPriceCounter += this.recordList[i].totalCostPrice;
      }
    }else{
      this.isSuccess = false;
    }
    this.selectedVendor = 'Select Vendor';
    if (this.dropdownComponent) {
      this.dropdownComponent.setDefaultValue();
    }
    // this.recordList.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
  }
  withdrawalListManagementError(error){
    this.isLoading=false;
    Swal.fire(
      'Error',
      error.error.message_status,
      'error'
    );
  }

  checkboxCheck(index){
    let text = "checkbox";
    const id = text+index;
    const checkBox = document.getElementById(id) as HTMLInputElement;
    const mainCheckBox = document.getElementById('mainCheckbox') as HTMLInputElement;
    const isCheckBoxSelected = checkBox.checked;

    mainCheckBox.checked=false;

    if(isCheckBoxSelected){
      this.checkedPriceCount += this.recordList[index].totalCostPrice;
    }else{
      this.checkedPriceCount -= this.recordList[index].totalCostPrice;
    }
  }

  selectAllCheckBoxes(){
    const checkBoxList = document.getElementsByClassName('checkboxList');
    var checkBox = document.getElementById('mainCheckbox') as HTMLInputElement;
    if(checkBox.checked){
      this.checkedPriceCount = this.totalPriceCounter;
      for(let i=0;i<checkBoxList.length;i++){
        const checkBox = checkBoxList[i] as HTMLInputElement;
        checkBox.checked=true;
      }
    }else{
      this.checkedPriceCount = 0;
      for(let i=0;i<checkBoxList.length;i++){
        const checkBox = checkBoxList[i] as HTMLInputElement;
        checkBox.checked=false;
      }
    }
  }

  approve(){
    const checkBoxList = document.getElementsByClassName('checkboxList');
    const approvalButton = document.getElementById('approveBtn') as HTMLInputElement;
    approvalButton.disabled=true;
    let idWithdrawalList = "";
    let checkedCount = 0;
    for(let i=0;i<checkBoxList.length;i++){
      const checkBox = checkBoxList[i] as HTMLInputElement;
      if(checkBox.checked){
        let idWithdrawal = this.recordList[i].idWithdrawal;
        idWithdrawalList+=idWithdrawal+",";
        checkedCount++;
      }
    }
    if(checkedCount>0){
      const lastCommaIndex = idWithdrawalList.lastIndexOf(',');
      if (lastCommaIndex !== -1) {
        idWithdrawalList = idWithdrawalList.substring(0, lastCommaIndex) + idWithdrawalList.substring(lastCommaIndex + 1);
      }

      let payload = {
        idWithdrawalList: idWithdrawalList,
        approvedBy:sessionStorage.getItem('userId')
      };
      this.paymentService.approvedWithdrawalRequest(payload).subscribe(
        data => this.manageApprovedWithdrawalRequest(data),
        error => this.approvedWithdrawalRequestError()
      );
    }else{
      Swal.fire({
        title: "Warning!",
        text: "Please make a selection(s)",
        icon: "warning"
      });
      approvalButton.disabled=false;
    }

  }

  manageApprovedWithdrawalRequest(data){
    const approvalButton = document.getElementById('approveBtn') as HTMLInputElement;
    if(data.message_status=="Success"){
      Swal.fire({
        title: "Successful!",
        text: data.message,
        icon: "success"
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.sessionUser === 'ROLE_ADMIN' || this.sessionUser === 'ROLE_SUPER_ADMIN'){
            this.getWithdrawalsList(this.lastSelectedVendor.value);
            approvalButton.disabled=false;
          }
        }
      });
    }else if(data.message_status=="Error"){
      Swal.fire({
        title: "Error!",
        text: data.message,
        icon: "error"
      });
      approvalButton.disabled=false;
    }else{
      Swal.fire({
        title: "Error!",
        text: "Something went wrong",
        icon: "error"
      });
      approvalButton.disabled=false;
    }
  }
  approvedWithdrawalRequestError(){
    Swal.fire({
      title: "Error!",
      text: "Something went wrong",
      icon: "error"
    });
    const approvalButton = document.getElementById('approveBtn') as HTMLInputElement;
    approvalButton.disabled=false;
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
