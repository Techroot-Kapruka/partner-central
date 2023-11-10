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
  public shipmentRowCount = 100;
  public selected = [];
  public isAdmin = false;
  public isShipmentValid = false;
  public shipmentErrorMsg = false;

  constructor(private shipmentNewService: ShipmentNewService, private router: Router) {
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN' || sessionUser === 'ROLE_STORES_MANAGER') {
      this.isAdmin = true;
    }
    this.getTakeShippedShipment();
  }

  ngOnInit(): void {
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  getTakeShippedShipment() {
    if (this.isAdmin) {
      this.shipmentNewService.getAllTakeShippedShipment().subscribe(
        data => this.ManageShippedShipment(data),
      );
    } else if (!this.isAdmin) {
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
      for (let i = 0; i < data.data.length; i++) {
        let or = {
          shipmentId: data.data[i].shipment_id,
          businessName: data.data[i].businessName,
          createDate: data.data[i].create_date,
          totalQuantity: data.data[i].total_quantity,
          grossAmount: data.data[i].gross_amount,
          received: data.data[i].is_receive,
          Action: ''
        };
        this.allShipmentArr.push(or);
      }
      this.allShipmentArr.sort((a, b) => {
        return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
      });
    } else {
      this.isShipmentValid = false;
      this.shipmentErrorMsg = true;

    }
  }

  viewShippedShipment(index) {
    let tempCode = this.allShipmentArr[index].shipmentId;
    let url = '/shipment/receive-shipment-make/' + tempCode;
    this.router.navigate([url]);
  }
}
