import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShipmentNewService} from '../../../shared/service/shipment-new.service';
import {FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'app-make-reserved',
  templateUrl: './make-reserved.component.html',
  styleUrls: ['./make-reserved.component.scss']
})
export class MakeReservedComponent implements OnInit {
  public shipmentForm: FormGroup;
  public id = '';
  public tableData = [];
  public updatedTableData = [];
  public tableDataForPayloard = [];
  public partnerId = '';
  public partnerName = '';
  public i = '';
  public allApprovedQty: number = 0;
  public allRejectedQty: number = 0;
  public grossAmount: number = 0;
  public allQuantity: number = 0;
  private allGrossAmount: number = 0;
  private allRejectedAmount: number = 0;
  isStoreManager = false;

  constructor(private _Activatedroute: ActivatedRoute, private shipmentNewService: ShipmentNewService, private router: Router) {
    this._Activatedroute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getshipmentById(params.get('id'));
    });
    this.createFormConteolerForShipment();
    this.setName();
  }

  ngOnInit(): void {
    this.checkIsStoreManager();
  }

  checkIsStoreManager() {
    if (sessionStorage.getItem('userRole') === 'ROLE_STORES_MANAGER') {
      this.isStoreManager = true;
    }
  }

  setName() {
    let role = sessionStorage.getItem('userRole');
    if (role === 'ROLE_PARTNER') {
      this.partnerId = sessionStorage.getItem('partnerId');
      this.partnerName = sessionStorage.getItem('businessName');
    }
  }

  getshipmentById(ids) {
    let payLoard = {
      shipment_id: ids
    };
    this.shipmentNewService.getShipmentUsingId(payLoard).subscribe(
      data => this.manageGetShipmentUsingId(data),
    );
  }

  viewerSelected_ReceivedShipment(i) {
    const shipmentId = this.id;
    this.router.navigate(['/shipment/selected-receive-shipment-make/' + shipmentId + '/' + i]);
  }

  createFormConteolerForShipment() {
    this.shipmentForm = new FormGroup({
      txtAllQuantity: new FormControl(''),
      txtGrossAmount: new FormControl(''),
      rejected_Amount: new FormControl(''),
      approved_Amount: new FormControl('')
      // txtChangingAmount: new FormControl(''),
      // txtChangingRate: new FormControl(''),
    });
  }

  manageGetShipmentUsingId(data) {

    const dataForm = data.data.shipmentItem;
    this.partnerId = data.data.vendor_code;
    this.partnerName = data.data.vendor_name;


    if (data.data.shipmentItem != null) {
      for (let i = 0; i < data.data.shipmentItem.length; i++) {
        let or = {
          product_code: dataForm[i].product_code,
          product_name: dataForm[i].product_name,
          cost_price: dataForm[i].cost_price,
          quantity: dataForm[i].quantity,
          selling_price: dataForm[i].selling_price,
          amount: dataForm[i].amount,
          approve_qty: dataForm[i].quantity,
          rejected_qty: '0',
          variation_code: dataForm[i].variation_code,
        };
        this.tableData.push(or);
      }
    }


    this.calculateAllQtyAndGrossAmount();
  }


  calculateAllQtyAndGrossAmount() {
    this.grossAmount = 0.0;
    this.allQuantity = 0;
    this.allGrossAmount = 0;
    for (let i = 0; i < this.tableData.length; i++) {
      let multifly = 0;
      let multifly2 = 0;
      let multifly3 = 0;
      multifly = Number(this.tableData[i].cost_price) * Number(this.tableData[i].approve_qty);
      multifly2 = Number(this.tableData[i].cost_price) * Number(this.tableData[i].quantity);
      multifly3 = Number(this.tableData[i].cost_price) * Number(this.tableData[i].rejected_qty);
      this.grossAmount += multifly;
      this.allGrossAmount += multifly2;
      this.allRejectedAmount += multifly3;
      this.allQuantity = this.allQuantity + Number(this.tableData[i].quantity);
    }
    this.shipmentForm.get('txtAllQuantity').setValue(this.allQuantity);
    this.shipmentForm.get('txtGrossAmount').setValue(this.allGrossAmount);
    this.shipmentForm.get('rejected_Amount').setValue(this.allRejectedAmount);
    this.shipmentForm.get('approved_Amount').setValue(this.grossAmount);
    (document.getElementById('txtAllApprovedQty') as HTMLInputElement).value = this.allQuantity.toString();
    (document.getElementById('txtAllRejectedQty') as HTMLInputElement).value = '0';
  }

  receivedShipment() {
    for (let i = 0; i < this.tableData.length; i++) {

      let rejectedQty = parseInt((document.getElementById('txtRejectedQty' + i) as HTMLInputElement).value);
      let approvedQty = parseInt(this.tableData[i].quantity) - rejectedQty;

      let td = {
        vendor_code: sessionStorage.getItem('partnerId'),
        product_code: this.tableData[i].product_code,
        product_name: this.tableData[i].product_name,
        cost_price: this.tableData[i].cost_price,
        quantity: this.tableData[i].quantity,
        selling_price: this.tableData[i].selling_price,
        amount: this.tableData[i].amount,
        approve_qty: approvedQty,
        rejected_qty: rejectedQty,
        variation_code: this.tableData[i].variation_code,
      };


      this.updatedTableData.push(td);

      let cr = {
        product_code: this.tableData[i].product_code,
        approved_qty: approvedQty,
        rejected_qty: rejectedQty,
        variation_code: this.tableData[i].variation_code
      };
      this.tableDataForPayloard.push(cr);
    }

    let payLoard = {

      vendor_code: this.partnerId,
      shipment_id: this.id,
      approved_user_id: sessionStorage.getItem('userId'),
      approved_all_qty: this.allApprovedQty,
      rejected_all_qty: this.allRejectedQty,
      shipmentItem: this.tableDataForPayloard
    };

    //     shipment_id: this.id,
    //     updated_user: sessionStorage.getItem('userId'),
    //     approved_qty: Number(this.tableData[i].quantity)
    //   };}

    //   let payLoard = {
    //     shipment_id: this.id,
    //     updated_user: sessionStorage.getItem('userId'),
    //     approved_qty: Number(this.tableData[i].quantity)
    //   };
    //
    this.shipmentNewService.getShipmentReceived(payLoard).subscribe(
      data => this.manageReceivedShipment(data),
    );
  }

  manageReceivedShipment(data) {
    if (data.status_code == 200) {
      Swal.fire(
        'Good Job...!',
        'Shipment Received success...!',
        'success'
      );
      this.createFormConteolerForShipment();
      this.tableData = [];
      this.id = '';
      this.partnerId = '';
      this.partnerName = '';


      let url = '/shipment/receive-shipment';
      this.router.navigate([url]);
    }else if(data.status_code == 400){
      Swal.fire(
        'Whoops...!',
        'Price change not Approved.!',
        'error'
      );
      this.createFormConteolerForShipment();
      this.tableData = [];
      this.id = '';
      this.partnerId = '';
      this.partnerName = '';


      let url = '/shipment/list-pending-shipment';
      this.router.navigate([url]);
    }
  }

  keypressEvent(event: KeyboardEvent, i) {

    let qty = Number(this.tableData[i].quantity);
    let rejectedQty = (document.getElementById('txtRejectedQty' + i) as HTMLInputElement).value;

    if (parseInt(rejectedQty) < 0) {
      Swal.fire(
        'Whoops...!',
        'number should be 0 to ' + qty,
        'question'
      );
      (document.getElementById('txtRejectedQty' + i) as HTMLInputElement).value = '0';

    } else {
      if (rejectedQty === '') {
        (document.getElementById('txtRejectedQty' + i) as HTMLInputElement).value = '0';
        rejectedQty = '0';

      } else if (parseInt(rejectedQty) > qty) {
        Swal.fire(
          'Whoops...!',
          'number should be below ' + qty,
          'question'
        );
        (document.getElementById('txtApprovedQty' + i) as HTMLInputElement).value = this.tableData[i].quantity;
        (document.getElementById('txtRejectedQty' + i) as HTMLInputElement).value = '0';
        rejectedQty = '0';
      }

      let Qty = (document.getElementById('Qty' + i) as HTMLInputElement).value;
      let approvedQty = parseInt(Qty) - parseInt(rejectedQty);
      this.tableData[i].approve_qty = approvedQty;
      this.tableData[i].rejected_qty = rejectedQty;
      this.tableData[i].amount = approvedQty * this.tableData[i].cost_price;

      this.grossAmount = 0.0;
      this.allQuantity = 0;
      this.allRejectedQty = 0;
      this.allApprovedQty = 0;
      this.allRejectedAmount = 0;

      for (let i = 0; i < this.tableData.length; i++) {
        this.allApprovedQty += parseInt(this.tableData[i].approve_qty);
        this.allRejectedQty += parseInt(this.tableData[i].rejected_qty);

        let multifly = 0;
        let multifly2 = 0;
        multifly = Number(this.tableData[i].cost_price) * Number(this.tableData[i].approve_qty);
        multifly2 = Number(this.tableData[i].cost_price) * Number(this.tableData[i].rejected_qty);
        this.grossAmount += multifly;
        this.allRejectedAmount += multifly2;

        this.allQuantity = this.allQuantity + Number(this.tableData[i].quantity);
      }

      (document.getElementById('txtAllRejectedQty') as HTMLInputElement).value = this.allRejectedQty.toString();
      (document.getElementById('txtAllApprovedQty') as HTMLInputElement).value = this.allApprovedQty.toString();


      this.shipmentForm.get('txtAllQuantity').setValue(this.allQuantity);
      this.shipmentForm.get('approved_Amount').setValue(this.grossAmount);
      this.shipmentForm.get('rejected_Amount').setValue(this.allRejectedAmount);
      (document.getElementById('txtAllApprovedQty') as HTMLInputElement).value = this.allApprovedQty.toString();
    }
  }


  validation(i) {
    let rejectedQty = (document.getElementById('txtRejectedQty' + i) as HTMLInputElement).value;
    if (rejectedQty == '') {
      Swal.fire(
        'Whoops...!',
        'Enter A Number',
        'question'
      );
      (document.getElementById('txtRejectedQty' + i) as HTMLInputElement).value = '0';
      (document.getElementById('txtApprovedQty' + i) as HTMLInputElement).value = this.tableData[i].quantity.toString();
    }
  }

  selectAllText(inputElement: HTMLInputElement): void {
    inputElement.select();
  }
}
