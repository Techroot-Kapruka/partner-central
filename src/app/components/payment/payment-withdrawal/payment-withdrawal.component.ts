import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PaymentService} from '../../../shared/service/payment.service';
import {ProductService} from '../../../shared/service/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-withdrawal',
  templateUrl: './payment-withdrawal.component.html',
  styleUrls: ['./payment-withdrawal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentWithdrawalComponent implements OnInit {
  public isAdmin = true;
  public isPartnerSelected = false;
  public recordList;
  public checkedCostPriceCount = 0;
  public totalPriceCounter = 0;
  public partnerBusinessName ="";

  checkBoxStatusMap = [];
  vnCodeList = "";
  public isSuccess = false;
  public partnerArray = [];
  partnerID ="";
  attemptNumber = 0;
  isLoading:boolean;

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
      let partnerId = sessionStorage.getItem('partnerId');
      this.isAdmin=false;
      this.getPaymentList(partnerId);
    }
  }
  partnerListError(error){
    Swal.fire(
      'Error',
      error.error.message_status,
      'error'
    );
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

  getPaymentList(partnerId) {
    if(this.isAdmin){
      var partnerName = document.getElementById('selectPartnersDropDown') as HTMLSelectElement;
      this.partnerBusinessName = partnerName.options[partnerName.selectedIndex].text;
    }

    this.isLoading=true;
    this.partnerID = partnerId;
    this.isPartnerSelected=true;

    let payload = {
        vendor_code: this.partnerID
    };
    this.paymentService.getVendorWisePaymentList(payload).subscribe(
      data => this.managePaymentList(data),
      error => this.paymentListManagementError(error)
    );
  }
  paymentListManagementError(error){
    this.isLoading=false;
    this.isSuccess=false;
    Swal.fire(
      'Error',
      error.error.message_status,
      'error'
    );
  }
  managePaymentList(response) {
    this.isLoading=false;
    this.totalPriceCounter=0;
    if(response.message==="Success"){

      this.isSuccess = true;
      this.recordList=[];

      this.recordList = Object.entries(response.data).map(([reference_id, data],index) => ({
        index:index,
        referenceId: reference_id,
        description:data['supplierPaymentDetailDTOList'].map(detail => ({
          supplierId:detail.supOID,
          itemCode: detail.itemCode,
          costPrice: detail.costPrice,
          createDate: detail.createDate,
          itemQuantity: Math.abs(detail.itemQTY),
          status: detail.itemQTY < 0 ? 'Delivered' : 'Returned'
        })),
        totalCostPrice:data['totalCostPrice'],
        kpDeliveryDate : data['kpDeliveryDate']
      }));
      for(let i = 0;i<this.recordList.length;i++){
        this.totalPriceCounter+=this.recordList[i].totalCostPrice;
      }
      if(this.attemptNumber>0 && !this.isAdmin){
        let withdrawalBtn = document.getElementById('withdrawalBtn') as HTMLInputElement;
        withdrawalBtn.disabled=false;
      }
      this.attemptNumber++;
    }else{
      this.isSuccess = false;
    }
    this.recordList.sort((a, b) => {
      const dateA = new Date(a.kpDeliveryDate);
      const dateB = new Date(b.kpDeliveryDate);
      return dateB.getTime() - dateA.getTime();
    });
  }

  ngOnInit(): void {
  }

  selectAllCheckBoxes(){
    let mainCheckBox = document.getElementById('mainCheckbox') as HTMLInputElement;
    let checkboxes = document.getElementsByClassName('checkBoxSet');

    if(mainCheckBox.checked){
      for(let i =0;i<checkboxes.length;i++){
        let checkbox = checkboxes[i] as HTMLInputElement;
        checkbox.checked=true;
      }
      for(let i =0;i<this.recordList.length;i++){
        let checkboxId = "checkbox"+i;
        let checkedValObj = {}
        const existingObj = this.checkBoxStatusMap.some(obj => checkboxId in obj);
        if(existingObj){
          this.checkBoxStatusMap.forEach(obj => {
            if (checkboxId in obj) {
              obj[checkboxId] = true;
            }
          });
        }else{
          checkedValObj[checkboxId]=true;
          this.checkBoxStatusMap.push(checkedValObj);
        }
      }
      this.checkedCostPriceCount= this.totalPriceCounter;
    }else{
      for(let i =0;i<checkboxes.length;i++){
        let checkbox = checkboxes[i] as HTMLInputElement;
        checkbox.checked=false;
      }
      this.checkBoxStatusMap=[];
      this.checkedCostPriceCount=0;
    }
  }
   checkBoxCheck(index, price) {
    let mainCheckBox = document.getElementById('mainCheckbox') as HTMLInputElement;
    mainCheckBox.checked=false;

    let checkboxId = "checkbox" + index;
    let checkbox = document.getElementById(checkboxId) as HTMLInputElement;
    let checkedValObj = {}
    const existingObj = this.checkBoxStatusMap.some(obj => checkboxId in obj);
    if (existingObj) {
      if (checkbox.checked) {
        this.checkedCostPriceCount += price;
        this.checkBoxStatusMap.forEach(obj => {
          if (checkboxId in obj) {
            obj[checkboxId] = true;
          }
        });
      } else {
        this.checkedCostPriceCount -= price;
        this.checkBoxStatusMap.forEach(obj => {
          if (checkboxId in obj) {
            obj[checkboxId] = false;
          }
        });
      }
    } else {
      if (checkbox.checked) {
        checkedValObj[checkboxId] = true;
        this.checkedCostPriceCount += price;
        this.checkBoxStatusMap.push(checkedValObj);
      }
    }
  }

  withdrawal(){
    let withdrawalBtn = document.getElementById('withdrawalBtn') as HTMLInputElement;
    withdrawalBtn.disabled = true;
    this.vnCodeList="";
    for (const obj of this.checkBoxStatusMap) {
      for (const key in obj) {
        if (obj[key] === true) {
          const match = key.match(/\d+$/);
          const lastIndex = match[0];
          let vnCodeId = "vnCode"+lastIndex;

          let vnCode = document.getElementById(vnCodeId);
          this.vnCodeList+=","+vnCode.textContent;
        }
      }
    }
    if(this.vnCodeList!=""){
      let userId = sessionStorage.getItem('userId');
      let partnerId = sessionStorage.getItem('partnerId');
      let selectedTotalPrice = this.checkedCostPriceCount;
      this.vnCodeList = this.vnCodeList.replace(/\s/g, '').replace(',', '');

      const payload = {
        user:userId,
        vendorCode:partnerId,
        totalCostPrice:selectedTotalPrice,
        vnCodes:this.vnCodeList
      }
      this.paymentService.saveVendorWithdrawalDetails(payload).subscribe(
        data => this.manageVendorWithdrawals(data),
        error => this.errorFunction()
      );
      this.totalPriceCounter=0;
      this.checkedCostPriceCount=0;
    }else{
      Swal.fire(
        'Error',
        'Please make a Selection(s)',
        'warning'
      );
      withdrawalBtn.disabled = false;
    }
  }
  manageVendorWithdrawals(data){
    if (data.message_status === 'Error'){
      Swal.fire(
        'Error!',
        data.message,
        'error'
      );
    }else if(data.message_status === 'Success'){
      Swal.fire(
        'Successful!',
        data.message,
        'success'
      );
    }
    this.getPaymentList(this.partnerID);
  }
  errorFunction(){
    let withdrawalBtn = document.getElementById('withdrawalBtn') as HTMLInputElement;
    withdrawalBtn.disabled = false;
    Swal.fire(
      'Error!',
      "Something went wrong",
      'error'
    );
  }
}
