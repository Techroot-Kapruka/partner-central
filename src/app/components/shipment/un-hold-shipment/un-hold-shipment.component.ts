import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {ShipmentNewService} from "../../../shared/service/shipment-new.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-un-hold-shipment',
  templateUrl: './un-hold-shipment.component.html',
  styleUrls: ['./un-hold-shipment.component.scss']
})
export class UnHoldShipmentComponent implements OnInit {
  public shipmentForm: FormGroup;
  public tableData = [];
  public searchProductArray = [];
  public shipArray = [];
  public id = '';
  public tableData2 = [];
  public globleIndex = 0;

  constructor(private shipmentNewService: ShipmentNewService, private _Activatedroute: ActivatedRoute, private router: Router) {
    this.createFormConteolerForShipment();

    this._Activatedroute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getshipmentById(params.get('id'));
    });
  }

  ngOnInit(): void {
  }

  createFormConteolerForShipment() {
    this.shipmentForm = new FormGroup({
      txtSearchBox: new FormControl(''),
      txtProductCode: new FormControl(''),
      txtProductName: new FormControl(''),
      txtCostPrice: new FormControl(''),
      txtSellingPrice: new FormControl(''),
      txtQuantity: new FormControl(''),
      txtAmount: new FormControl(''),
      txtAllQuantity: new FormControl(''),
      txtGrossAmount: new FormControl(''),
      txtChangingAmount: new FormControl(''),
      txtChangingRate: new FormControl(''),
      txtId: new FormControl(''),
    });
  }

  deleteTableRow(index) {
    this.tableData2[index].status = 1;
    this.tableData.splice(index, 1);
    this.geAllQtyAndGrossAmount();
  }

  editTableRow(index) {

    this.globleIndex = index;

    document.getElementById('eidtBtn').style.display = 'block';
    document.getElementById('addToTbleBtn').style.display = 'none';
    if (this.tableData[index].changing_amount == 0) {
      (document.getElementById('txtChangingAmount') as HTMLInputElement).disabled = true;
      (document.getElementById('txtChangingRate') as HTMLInputElement).disabled = false;

    } else if (this.tableData[index].changing_rate == 0) {
      (document.getElementById('txtChangingAmount') as HTMLInputElement).disabled = false;
      (document.getElementById('txtChangingRate') as HTMLInputElement).disabled = true;
    }

    document.getElementById('txt_aria').style.display = 'block';


    this.shipmentForm.get('txtProductCode').setValue(this.tableData[index].product_code);
    this.shipmentForm.get('txtProductName').setValue(this.tableData[index].product_name);
    this.shipmentForm.get('txtCostPrice').setValue(this.tableData[index].cost_price);
    this.shipmentForm.get('txtSellingPrice').setValue(this.tableData[index].selling_price);
    this.shipmentForm.get('txtQuantity').setValue(this.tableData[index].quantity);
    this.shipmentForm.get('txtAmount').setValue(this.tableData[index].amount);
    this.shipmentForm.get('txtAllQuantity').setValue(this.shipmentForm.value.txtAllQuantity);
    this.shipmentForm.get('txtGrossAmount').setValue(this.shipmentForm.value.txtGrossAmount);
    this.shipmentForm.get('txtChangingAmount').setValue(this.tableData[index].changing_amount);
    this.shipmentForm.get('txtChangingRate').setValue(this.tableData[index].changing_rate);
    this.shipmentForm.get('txtId').setValue(this.tableData[index].id);
  }

  addToTable() {
    let dataForm = this.shipmentForm.value;
    if (dataForm.txtProductCode == '') {
      Swal.fire(
        'Whoops...!',
        'Product Code empty',
        'error'
      );
    } else if (dataForm.txtProductName == '') {
      Swal.fire(
        'Whoops...!',
        'Product Name empty',
        'error'
      );
    } else if (dataForm.txtCostPrice == '') {
      Swal.fire(
        'Whoops...!',
        'Product Cost Price empty',
        'error'
      );
    } else if (dataForm.txtQuantity == '') {
      Swal.fire(
        'Whoops...!',
        'Product Quantity empty',
        'error'
      );
    } else if (dataForm.txtSellingPrice == '') {
      Swal.fire(
        'Whoops...!',
        'Selling Price empty',
        'error'
      );
    } else if (dataForm.txtAmount == '') {
      Swal.fire(
        'Whoops...!',
        'Amount empty',
        'error'
      );
    } else {
      let dataId = 0;
      if (dataForm.txtId == '') {
        dataId = 0;
      }
      let insertTabelData = {
        id: dataId,
        status: 0,
        product_code: dataForm.txtProductCode,
        product_name: dataForm.txtProductName,
        cost_price: dataForm.txtCostPrice,
        quantity: dataForm.txtQuantity,
        selling_price: dataForm.txtSellingPrice,
        amount: dataForm.txtAmount
      };
      this.tableData.push(insertTabelData);
      this.tableData2.push(insertTabelData);
      this.geAllQtyAndGrossAmount();
      document.getElementById('txt_aria').style.display = 'none';
    }
  }

  searchProduct() {
    // txt_aria

    let payLoard = {
      title: this.shipmentForm.value.txtSearchBox
    };
    if (this.shipmentForm.value.txtSearchBox == '') {
      Swal.fire(
        'Whoops...!',
        'Please enter key word before search...!',
        'error'
      );
      this.searchProductArray = [];
    } else {
      this.shipmentNewService.searchProductGet(payLoard).subscribe(
        data => this.ManageSearchProductGet(data),
      );
    }
  }

  selectedProduct(code) {
    if (code.changing_amount == 0) {
      (document.getElementById('txtChangingAmount') as HTMLInputElement).disabled = true;
      (document.getElementById('txtChangingRate') as HTMLInputElement).disabled = false;
    } else if (code.changing_rate == 0) {
      (document.getElementById('txtChangingAmount') as HTMLInputElement).disabled = false;
      (document.getElementById('txtChangingRate') as HTMLInputElement).disabled = true;
    }
    document.getElementById('txt_aria').style.display = 'block';
    this.shipmentForm = new FormGroup({
      txtSearchBox: new FormControl(''),
      txtProductCode: new FormControl(code.product_code),
      txtProductName: new FormControl(code.name),
      txtCostPrice: new FormControl(code.cost_price),
      txtSellingPrice: new FormControl(code.selling_price),
      txtQuantity: new FormControl(code.qty),
      txtAmount: new FormControl(code.amount),
      txtAllQuantity: new FormControl(''),
      txtGrossAmount: new FormControl(''),
      txtChangingAmount: new FormControl(code.changing_amount),
      txtChangingRate: new FormControl(code.changing_rate),
      txtId: new FormControl('')

    });

    this.searchProductArray = [];
  }

  hitShipment() {
    let partnerId = sessionStorage.getItem('partnerId');
    this.shipArray = [];
    if (this.tableData.length == 0) {
      Swal.fire(
        'Whoops...!',
        'Table can not empty....',
        'error'
      );
    } else {
      for (let i = 0; i < this.tableData2.length; i++) {
        let or = {
          id: this.tableData2[i].id,
          status: this.tableData2[i].status,
          product_code: this.tableData2[i].product_code,
          product_name: this.tableData2[i].product_name,
          cost_price: Number(this.tableData2[i].cost_price),
          quantity: Number(this.tableData2[i].quantity),
          changing_amount: Number(this.tableData2[i].changing_amount),
          changing_rate: Number(this.tableData2[i].changing_rate),
          selling_price: this.tableData2[i].selling_price
        };
        this.shipArray.push(or);
      }
      let payLoard = {
        shipment_id: this.id,
        vendor_code: partnerId,
        shipmentItem: this.shipArray
      };
      this.shipmentNewService.unHoldAndsaveShipment(payLoard).subscribe(
        data => this.manageSaveShipment(data),
      );
    }
  }

  manageSaveShipment(data) {
    Swal.fire(
      'Good Job...!',
      data.message,
      'success'
    );
    this.tableData = [];
    this.shipmentForm.get("txtChangingRate").setValue(0.0);
    this.shipmentForm.get("txtChangingAmount").setValue(0.0);
    this.shipmentForm.get("txtGrossAmount").setValue(0.0);
    this.shipmentForm.get("txtAllQuantity").setValue(0);
    document.getElementById('txt_aria').style.display = 'none';
    // let url = '/shipment/list-shipment';
    let url = '/shipment/receive-shipment';
    this.router.navigate([url]);
  }

  ManageSearchProductGet(data) {
    this.searchProductArray = [];
    if (data.data == null) {
      Swal.fire(
        'Whoops...!',
        'Can not find Product.',
        'error'
      );
      this.searchProductArray = [];
      this.createFormConteolerForShipment();
    } else {
      for (let i = 0; i < data.data.length; i++) {
        let or = {
          product_code: data.data[i].product_code,
          name: data.data[i].name,
          qty: data.data[i].qty,
          cost_price: data.data[i].cost_price,
          selling_price: data.data[i].selling_price,
          amount: data.data[i].amount,
          changing_amount: data.data[i].changing_amount,
          changing_rate: data.data[i].changing_rate,
        };
        this.searchProductArray.push(or);
      }
    }
  }

  geAllQtyAndGrossAmount() {
    let grossAmount = 0.0;
    let allQuantity = 0;

    for (let i = 0; i < this.tableData.length; i++) {
      grossAmount = grossAmount + Number(this.tableData[i].amount);
      allQuantity = allQuantity + Number(this.tableData[i].quantity);

    }
    let val = String(grossAmount);

    (document.getElementById('txtAllQuantity') as HTMLInputElement).innerText = 'asdasd';
    (document.getElementById('txtGrossAmount') as HTMLInputElement).value = String(grossAmount);
    this.shipmentForm = new FormGroup({
      txtSearchBox: new FormControl(''),
      txtProductCode: new FormControl(''),
      txtProductName: new FormControl(''),
      txtCostPrice: new FormControl(''),
      txtSellingPrice: new FormControl(''),
      txtQuantity: new FormControl(''),
      txtAmount: new FormControl(''),
      txtAllQuantity: new FormControl(allQuantity),
      txtGrossAmount: new FormControl(grossAmount),
      txtChangingAmount: new FormControl(''),
      txtChangingRate: new FormControl(''),
      txtId: new FormControl(''),
    });
  }

  getshipmentById(ids) {
    let payLoard = {
      shipment_id: ids
    };
    this.shipmentNewService.getShipmentUsingId(payLoard).subscribe(
      data => this.manageGetShipmentUsingId(data),
    );
  }

  manageGetShipmentUsingId(data) {
    if (data.data.shipmentItem != null) {
      let dataForm = data.data.shipmentItem;
      for (let i = 0; i < data.data.shipmentItem.length; i++) {
        let or = {
          id: dataForm[i].id,
          product_code: dataForm[i].product_code,
          product_name: dataForm[i].product_name,
          cost_price: dataForm[i].cost_price,
          quantity: dataForm[i].quantity,
          selling_price: dataForm[i].selling_price,
          amount: dataForm[i].amount,
          changing_amount: dataForm[i].changing_amount,
          changing_rate: dataForm[i].changing_rate,
          status: dataForm[i].status
        };
        this.tableData.push(or);
        this.tableData2.push(or);
      }
    }

    this.calculateAllQtyAndGrossAmount();
  }

  changeingRateCalculate() {
    let sellingAmount = Number(this.shipmentForm.value.txtCostPrice) + (Number(this.shipmentForm.value.txtChangingRate) * Number(this.shipmentForm.value.txtCostPrice) / 100);
    this.shipmentForm.get("txtSellingPrice").setValue(sellingAmount);
  }

  changingAmountCalculation() {
    let sellingAmount = Number(this.shipmentForm.value.txtChangingAmount) + Number(this.shipmentForm.value.txtCostPrice);
    this.shipmentForm.get("txtSellingPrice").setValue(sellingAmount);
  }

  calculateAmount() {
    let costPrice: number = Number(this.shipmentForm.value.txtCostPrice);
    let quantity: number = Number(this.shipmentForm.value.txtQuantity);
    let amount: number = costPrice * quantity;
    this.shipmentForm.get("txtAmount").setValue(amount);
  }

  calculateAllQtyAndGrossAmount() {
    let grossAmount = 0.0;
    let allQuantity = 0;
    if (this.tableData != null) {
      for (let i = 0; i < this.tableData.length; i++) {
        grossAmount = grossAmount + Number(this.tableData[i].amount);
        allQuantity = allQuantity + Number(this.tableData[i].quantity);
      }
    }

    this.shipmentForm.get('txtAllQuantity').setValue(allQuantity);
    this.shipmentForm.get('txtGrossAmount').setValue(grossAmount);
  }

  editRowUpdate() {
    this.tableData[this.globleIndex].amount = this.shipmentForm.value.txtAmount;
    this.tableData[this.globleIndex].changing_amount = Number(this.shipmentForm.value.txtChangingAmount);
    this.tableData[this.globleIndex].changing_rate = Number(this.shipmentForm.value.txtChangingRate);
    this.tableData[this.globleIndex].cost_price = Number(this.shipmentForm.value.txtCostPrice);
    this.tableData[this.globleIndex].id = this.shipmentForm.value.txtId;
    this.tableData[this.globleIndex].product_code = this.shipmentForm.value.txtProductCode;
    this.tableData[this.globleIndex].product_name = this.shipmentForm.value.txtProductName;
    this.tableData[this.globleIndex].quantity = Number(this.shipmentForm.value.txtQuantity);
    this.tableData[this.globleIndex].selling_price = this.shipmentForm.value.txtSellingPrice;
    this.tableData[this.globleIndex].status = 0;

    this.tableData2[this.globleIndex].amount = this.shipmentForm.value.txtAmount;
    this.tableData2[this.globleIndex].changing_amount = Number(this.shipmentForm.value.txtChangingAmount);
    this.tableData2[this.globleIndex].changing_rate = Number(this.shipmentForm.value.txtChangingRate);
    this.tableData2[this.globleIndex].cost_price = Number(this.shipmentForm.value.txtCostPrice);
    this.tableData2[this.globleIndex].id = this.shipmentForm.value.txtId;
    this.tableData2[this.globleIndex].product_code = this.shipmentForm.value.txtProductCode;
    this.tableData2[this.globleIndex].product_name = this.shipmentForm.value.txtProductName;
    this.tableData2[this.globleIndex].quantity = Number(this.shipmentForm.value.txtQuantity);
    this.tableData2[this.globleIndex].selling_price = this.shipmentForm.value.txtSellingPrice;
    this.tableData2[this.globleIndex].status = 0;
    Swal.fire(
      'Good Job...!',
      'Update Success...!',
      'success'
    );
  }

  calculateCost() {
    let sellingAmount = (Number(this.shipmentForm.value.txtCostPrice) + (Number(this.shipmentForm.value.txtChangingRate) * Number(this.shipmentForm.value.txtCostPrice)) / 100) + Number(this.shipmentForm.value.txtChangingAmount);
    this.shipmentForm.get("txtSellingPrice").setValue(sellingAmount);
    let costPrice: number = Number(this.shipmentForm.value.txtCostPrice);
    let quantity: number = Number(this.shipmentForm.value.txtQuantity);
    let amount: number = costPrice * quantity;
    this.shipmentForm.get("txtAmount").setValue(amount);
  }

  calculateAmount22() {
  }
}
