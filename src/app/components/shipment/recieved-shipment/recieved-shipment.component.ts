import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShipmentNewService} from '../../../shared/service/shipment-new.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recieved-shipment',
  templateUrl: './recieved-shipment.component.html',
  styleUrls: ['./recieved-shipment.component.scss']
})
export class RecievedShipmentComponent implements OnInit {
  public id = '';
  public i = '';
  public tableData = [];
  public partnerId = '';
  public partnerName = '';
  public code = '';
  public name = '';
  public price = '';
  public quantity = 0;
  public rejectedQuantity = 0;
  public netQuantity = 0;

  constructor(private ActivateRoute: ActivatedRoute, private Route: Router, private ShipmentService: ShipmentNewService) {

    this.ActivateRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.i = params.get('i');
      this.SetSelectedShipmentArray(this.id);
    });
  }

  ngOnInit(): void {
  }

  checkIsStoreManager() {
    if (sessionStorage.getItem('userRole') === 'ROLE_STORES_MANAGER') {
      return false;
    } else {
      return true;
    }
  }

  private SetSelectedShipmentArray(id: string) {
    let payLoard = {
      shipment_id: id
    };
    this.ShipmentService.getShipmentUsingId(payLoard).subscribe(
      data => {
        this.manageGetSelectedShipmentUsingId(data, this.i);
      },
    );
  }

  private manageGetSelectedShipmentUsingId(data, i) {
    // tslint:disable-next-line:variable-name
    const selectedDataForm = data.data.shipmentItem;
    this.partnerId = data.data.vendor_code;
    this.partnerName = data.data.vendor_name;

    if (data.data.shipmentItem != null) {
      for (let i = 0; i < data.data.shipmentItem.length; i++) {
        let or = {
          product_code: selectedDataForm[i].product_code,
          product_name: selectedDataForm[i].product_name,
          cost_price: selectedDataForm[i].cost_price,
          quantity: selectedDataForm[i].quantity,
          selling_price: selectedDataForm[i].selling_price,
          amount: selectedDataForm[i].amount
        };
        this.tableData.push(or);
      }
      // tslint:disable-next-line:radix
      const Obj = this.tableData[parseInt(i)];
      this.code = Obj.product_code;
      this.name = Obj.product_name;
      this.quantity = Obj.quantity;
      this.price = Obj.cost_price;
      this.netQuantity = this.quantity - this.rejectedQuantity;
    }

  }

  getNetQuantity() {
    // tslint:disable-next-line:radix
    this.rejectedQuantity = parseInt((document.getElementById('txtRejectedQty') as HTMLInputElement).value);
    this.netQuantity = this.quantity - this.rejectedQuantity;
    (document.getElementById('txtNetQuantity') as HTMLInputElement).value = String(this.netQuantity);
  }

  receivedShipment() {
    if (this.quantity > this.rejectedQuantity && this.rejectedQuantity >= 0) {

      let payLoard = {
        shipment_id: this.id,
        updated_user: sessionStorage.getItem('userId'),
        rejected_qty: (document.getElementById('txtRejectedQty') as HTMLInputElement).value,
        approved_qty: (document.getElementById('txtNetQuantity') as HTMLInputElement).value
      };

      this.ShipmentService.getShipmentReceivedWithRejected(payLoard).subscribe(
        data => this.manageReceivedShipment(data),
      );
    } else {
      (document.getElementById('ValidateLBL') as HTMLInputElement).style.display = 'block';
    }
  }

  manageReceivedShipment(data) {
    if (data.status_code == 200) {
      Swal.fire(
        'Good Job...!',
        'Shipment Received success...!',
        'success'
      );
      this.tableData = [];
      this.id = '';
      this.partnerId = '';
      this.partnerName = '';


      let url = '/shipment/receive-shipment';
      this.Route.navigate([url]);
    }
  }
}
