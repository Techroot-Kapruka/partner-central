import {Component, OnInit} from '@angular/core';
import {ShipmentNewService} from '../../../shared/service/shipment-new.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-hold-shipment',
  templateUrl: './list-hold-shipment.component.html',
  styleUrls: ['./list-hold-shipment.component.scss']
})

export class ListHoldShipmentComponent implements OnInit {
  public selected = [];
  public holdShipmentArray = [];
  public columnArray = [];
  public isShipmentValid = false;
  public shipmentErrorMsg = false;

  constructor(private shipmentNewService: ShipmentNewService, private router: Router) {
    this.columnArray = [
      {header: 'Shipment ID', fieldName: 'shipment_id', dataType: 'string', bColor: '', bValue: ''},
      {header: 'Create Date', fieldName: 'create_date', dataType: 'date', bColor: '', bValue: ''},
      {header: 'Total Quantity', fieldName: 'total_quantity', dataType: 'string', bColor: '', bValue: ''},
      {header: 'Gross Amount', fieldName: 'gross_amount', dataType: 'string', bColor: '', bValue: ''},
      {header: 'Received', fieldName: 'is_receive', dataType: 'string', bColor: 'red', bValue: ''},
      {header: 'Action', fieldName: '', dataType: '', bColor: '', bValue: ' Edit '},
    ];
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
      this.isShipmentValid = true;
      this.shipmentErrorMsg = false;
      this.holdShipmentArray = data.data;
      this.holdShipmentArray.forEach(element => {
        element.create_date = new Date();
      });
    }else{
      this.isShipmentValid = false;
      this.shipmentErrorMsg = true;
    }
  }

  viewHoldShipment(tempCode) {
    let url = '/shipment/edit-shipment/' + tempCode;
    this.router.navigate([url]);
  }
}
