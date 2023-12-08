import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PaymentService} from '../../../shared/service/payment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-withdrawal',
  templateUrl: './payment-withdrawal.component.html',
  styleUrls: ['./payment-withdrawal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentWithdrawalComponent implements OnInit {
  public isAdmin = true;
  public recordList;
  public checkedCostPriceCount = 0;
  public totalPriceCounter = 0;

  checkedUnchecked = [];
  vnCodeList = "";
  public isSuccess = false;

  constructor(private paymentService: PaymentService) {
    this.getPaymentList();
  }

  getPaymentList() {
    let sendObject = {};
    sendObject = {
      vendor_code: sessionStorage.getItem('partnerId')
    };
    this.paymentService.getVendorWisePaymentList(sendObject).subscribe(
      data => this.managePaymentList(data),
    );
  }

  managePaymentList(response) {
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
        totalCostPrice:data['totalCostPrice']
      }));
      for(var i = 0;i<this.recordList.length;i++){
        this.totalPriceCounter+=this.recordList[i].totalCostPrice;
      }
    }else{
      this.isSuccess = false;
    }
  }

  ngOnInit(): void {
  }

  selectAll(){
    var mainCheckBox = document.getElementById('mainCheckbox') as HTMLInputElement;
    var checkboxes = document.getElementsByClassName('checkBoxSet');

    if(mainCheckBox.checked){
      for(var i =0;i<checkboxes.length;i++){
        var checkbox = checkboxes[i] as HTMLInputElement;
        checkbox.checked=true;
      }
      for(var i =0;i<this.recordList.length;i++){
        var checkboxId = "checkbox"+i;
        var checkedValObj = {}
        const existingObj = this.checkedUnchecked.some(obj => checkboxId in obj);
        if(!existingObj){
          checkedValObj[checkboxId]=true;
          this.checkedUnchecked.push(checkedValObj);
        }else{
          this.checkedUnchecked.forEach(obj => {
            if (checkboxId in obj) {
              obj[checkboxId] = true;
            }
          });
        }
      }
      this.checkedCostPriceCount= this.totalPriceCounter;
    }else{
      for(var i =0;i<checkboxes.length;i++){
        var checkbox = checkboxes[i] as HTMLInputElement;
        checkbox.checked=false;
      }
      this.checkedUnchecked=[];
      this.checkedCostPriceCount=0;
    }
  }
  checkedFunction(index, price) {
    var mainCheckBox = document.getElementById('mainCheckbox') as HTMLInputElement;
    mainCheckBox.checked=false;

    var checkboxId = "checkbox" + index;
    var checkbox = document.getElementById(checkboxId) as HTMLInputElement;
    var checkedValObj = {}
    const existingObj = this.checkedUnchecked.some(obj => checkboxId in obj);
    if (existingObj) {
      if (checkbox.checked) {
        this.checkedCostPriceCount += price;
        this.checkedUnchecked.forEach(obj => {
          if (checkboxId in obj) {
            obj[checkboxId] = true;
          }
        });
      } else {
        this.checkedCostPriceCount -= price;
        this.checkedUnchecked.forEach(obj => {
          if (checkboxId in obj) {
            obj[checkboxId] = false;
          }
        });
      }
    } else {
      if (checkbox.checked) {
        checkedValObj[checkboxId] = true;
        this.checkedCostPriceCount += price;
        this.checkedUnchecked.push(checkedValObj);
      }
    }
  }

  withdrawal(){
    this.vnCodeList="";

    for (const obj of this.checkedUnchecked) {
      for (const key in obj) {
        if (obj[key] === true) {
          const lastCharacter = key.charAt(key.length - 1);
          var vnCodeId = "vnCode"+lastCharacter;

          var vnCode = document.getElementById(vnCodeId);
          this.vnCodeList+=","+vnCode.textContent;
        }
      }
    }
    if(this.vnCodeList!=""){
      var userId = sessionStorage.getItem('userId');
      var partnerId = sessionStorage.getItem('partnerId');
      var selectedTotalPrice = this.checkedCostPriceCount;
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
    }else{
      Swal.fire(
        'Error',
        'Please make a Selection(s)',
        'warning'
      );
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
    this.getPaymentList();
  }
  errorFunction(){
    Swal.fire(
      'Error!',
      "Something went wrong",
      'error'
    );
  }
}
