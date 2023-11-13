import {Component, OnInit} from '@angular/core';
import {ShipmentNewService} from '../../../shared/service/shipment-new.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-hold-shipment',
  templateUrl: './list-hold-shipment.component.html',
  styleUrls: ['./list-hold-shipment.component.scss']
})

export class ListHoldShipmentComponent implements OnInit {
  public shipmentRowCount = 20;
  public selected = [];
  public holdShipmentArray = [];
  public isAdmin = false;

  constructor(private shipmentNewService: ShipmentNewService, private router: Router) {
    this.getTakeHoldShipment();
  }

  ngOnInit(): void {
  }

  getTakeHoldShipment() {
    let payLoard = {
      vendor_code: sessionStorage.getItem('partnerId')
    };
    this.shipmentNewService.getAllTakeHoldShipment22(payLoard).subscribe(
      data => this.manageTakeHoldShipment(data),
    );
  }

  manageTakeHoldShipment(data) {
    this.holdShipmentArray = [];
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        let or = {
          shipmentId: data.data[i].shipment_id,
          createDate: data.data[i].create_date,
          totalQuantity: data.data[i].total_quantity,
          grossAmount: data.data[i].gross_amount,
          received: data.data[i].is_receive,
          Action: ''
        };
        this.holdShipmentArray.push(or);
      }
    }
  }

  viewHoldShipment(index) {
    let tempCode = this.holdShipmentArray[index].shipmentId;
    let url = '/shipment/edit-shipment/' + tempCode;
    this.router.navigate([url]);
  }
}
