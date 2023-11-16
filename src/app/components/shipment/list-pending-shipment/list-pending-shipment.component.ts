import {Component, OnInit} from '@angular/core';
import {ShipmentNewService} from '../../../shared/service/shipment-new.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-pending-shipment',
  templateUrl: './list-pending-shipment.component.html',
  styleUrls: ['./list-pending-shipment.component.scss']
})

export class ListPendingShipmentComponent implements OnInit {
  public allShipmentArr = [];
  public isAdmin = false;
  public isShipmentValid = false;
  public shipmentErrorMsg = false;
  public columnArray = [];

  constructor(private shipmentNewService: ShipmentNewService, private router: Router) {
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN' || sessionUser === 'ROLE_SUPER_ADMIN' || sessionUser === 'ROLE_STORES_MANAGER') {
      this.isAdmin = true;
      this.columnArray = [
        {header: 'Shipment ID', fieldName: 'shipment_id', dataType: 'string', bColor: '', bValue: ''},
        {header: 'Business Name', fieldName: 'businessName', dataType: 'string', bColor: '', bValue: ''},
        {header: 'Create Date', fieldName: 'create_date', dataType: 'date', bColor: '', bValue: ''},
        {header: 'Total Quantity', fieldName: 'total_quantity', dataType: 'string', bColor: '', bValue: ''},
        {header: 'Gross Amount', fieldName: 'gross_amount', dataType: 'string', bColor: '', bValue: ''},
        {header: 'Received', fieldName: 'is_receive', dataType: 'string', bColor: 'red', bValue: 'No'},
        {header: 'Action', fieldName: '', dataType: '', bColor: '', bValue: 'Receive'},
      ];
    } else {
      this.columnArray = [
        {header: 'Shipment ID', fieldName: 'shipment_id', dataType: 'string', bColor: '', bValue: ''},
        {header: 'Create Date', fieldName: 'create_date', dataType: 'date', bColor: '', bValue: ''},
        {header: 'Total Quantity', fieldName: 'total_quantity', dataType: 'string', bColor: '', bValue: ''},
        {header: 'Gross Amount', fieldName: 'gross_amount', dataType: 'string', bColor: '', bValue: ''},
        {header: 'Received', fieldName: 'is_receive', dataType: 'string', bColor: 'green', bValue: ''},
        {header: 'Action', fieldName: '', dataType: '', bColor: '', bValue: 'View'},
      ];
    }
    this.getTakeShippedShipment();
  }

  ngOnInit(): void {
  }

  getTakeShippedShipment() {
    if (this.isAdmin) {
      this.shipmentNewService.getAllTakeShippedShipment().subscribe(
        data => this.ManageShippedShipment(data),
      );
    } else {
      const payload = {
        vendor_code: sessionStorage.getItem('partnerId')
      };
      this.shipmentNewService.getShipmentByVendorId(payload).subscribe(
        data => this.ManageShippedShipment(data),
      );
    }
  }

  ManageShippedShipment(data) {
    this.allShipmentArr = [];
    if (data.data != null) {
      this.isShipmentValid = true;
      this.shipmentErrorMsg = false;

      this.allShipmentArr = data.data;
      this.allShipmentArr.sort((a, b) => {
        return new Date(b.create_date).getTime() - new Date(a.create_date).getTime();
      });
    } else {
      this.isShipmentValid = false;
      this.shipmentErrorMsg = true;
    }
  }

  viewShippedShipment(tempCode) {
    let url = '';
    if (this.isAdmin) {
      url = '/shipment/receive-shipment-make/' + tempCode;
    } else {
      url = '/shipment/view-shipment/' + tempCode;
    }
    this.router.navigate([url]);
  }
}
