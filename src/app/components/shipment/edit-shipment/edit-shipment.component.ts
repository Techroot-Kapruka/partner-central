import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShipmentNewService} from '../../../shared/service/shipment-new.service';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-shipment',
  templateUrl: './edit-shipment.component.html',
  styleUrls: ['./edit-shipment.component.scss']
})
export class EditShipmentComponent implements OnInit {
  public shipmentForm: FormGroup;
  public id = '';
  public tableData = [];
  public partnerId = '';
  public partnerName = '';

  constructor(private _Activatedroute: ActivatedRoute, private shipmentNewService: ShipmentNewService, private router: Router) {
    this._Activatedroute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getshipmentById(params.get('id'));
    });
    this.createFormConteolerForShipment();
  }

  ngOnInit(): void {
  }

  getshipmentById(ids) {
    const payLoard = {
      shipment_id: ids
    };
    this.shipmentNewService.getShipmentUsingId(payLoard).subscribe(
      data => this.manageGetShipmentUsingId(data),
    );
  }

  createFormConteolerForShipment() {
    this.shipmentForm = new FormGroup({
      txtAllQuantity: new FormControl(''),
      txtGrossAmount: new FormControl(''),
      txtRejectedQty: new FormControl(''),
      txtApprovedQty: new FormControl(''),
      txtApprovedAmount: new FormControl(''),
      txtRejectedAmount: new FormControl('')
      // txtChangingAmount: new FormControl(''),
      // txtChangingRate: new FormControl(''),
    });
  }

  manageGetShipmentUsingId(data) {

    this.partnerId = data.data.vendor_code;
    this.partnerName = data.data.vendor_name;

    this.shipmentForm.get('txtApprovedQty').setValue(data.data.txtApprovedQty);
    this.shipmentForm.get('txtRejectedQty').setValue(data.data.txtRejectedQty);
    this.shipmentForm.get('txtApprovedAmount').setValue(data.data.txtApprovedAmount);
    this.shipmentForm.get('txtRejectedAmount').setValue(data.data.txtRejectedAmount);

    if (data.data.shipmentItem != null) {
      const dataForm = data.data.shipmentItem;
      for (let i = 0; i < data.data.shipmentItem.length; i++) {
        const or = {
          product_code: dataForm[i].product_code,
          product_name: dataForm[i].product_name,
          cost_price: dataForm[i].cost_price.toFixed(2),
          rejected_qty: dataForm[i].rejected_qty,
          approved_qty: dataForm[i].approved_qty,
          quantity: dataForm[i].quantity,
          selling_price: dataForm[i].selling_price,
          amount: dataForm[i].amount.toFixed(2),
          approved_amount : dataForm[i].approved_amount.toFixed(2),
          rejected_amount : dataForm[i].rejected_amount.toFixed(2)
        };
        this.tableData.push(or);

      }
    }

    this.calculateAllQtyAndGrossAmount();
  }

  manageTakeHoldShipment() {

  }

  calculateAllQtyAndGrossAmount() {
    let grossAmount = 0.0;
    let allQuantity = 0;
    let approvedQty = 0;
    let rejectedQty = 0;
    let approvedAmount = 0.0;
    let rejectedAmount = 0.0;
    if (this.tableData != null) {
      for (let i = 0; i < this.tableData.length; i++) {
        grossAmount = grossAmount + Number(this.tableData[i].amount);
        allQuantity = allQuantity + Number(this.tableData[i].quantity);
        approvedQty = approvedQty + Number(this.tableData[i].approved_qty);
        rejectedQty = rejectedQty + Number(this.tableData[i].rejected_qty);
        approvedAmount = approvedAmount + Number(this.tableData[i].approved_amount);
        rejectedAmount = rejectedAmount + Number(this.tableData[i].rejected_amount);
      }
    }

    this.shipmentForm.get('txtAllQuantity').setValue(allQuantity);
    this.shipmentForm.get('txtGrossAmount').setValue(grossAmount.toFixed(2));
    this.shipmentForm.get('txtApprovedQty').setValue(approvedQty);
    this.shipmentForm.get('txtRejectedQty').setValue(rejectedQty);
    this.shipmentForm.get('txtApprovedAmount').setValue(approvedAmount.toFixed(2));
    this.shipmentForm.get('txtRejectedAmount').setValue(rejectedAmount.toFixed(2));
  }

  backToLIst() {

    if (sessionStorage.getItem('userRole') === 'ROLE_ADMIN' || sessionStorage.getItem('userRole') === 'ROLE_SUPER_ADMIN') {
      const url = '/shipment/receive-shipment';
      this.router.navigate([url]);

    } else {
      const url = '/shipment/list-shipment';
      this.router.navigate([url]);
    }
  }
}
