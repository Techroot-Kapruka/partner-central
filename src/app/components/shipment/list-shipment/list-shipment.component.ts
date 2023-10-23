import {Component, OnInit} from '@angular/core';
import {ShipmentNewService} from '../../../shared/service/shipment-new.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-shipment',
  templateUrl: './list-shipment.component.html',
  styleUrls: ['./list-shipment.component.scss']
})
export class ListShipmentComponent implements OnInit {
  public shipment_list = [];
  public allShipmentArr = [];
  public nonApproveUsersArr = [];
  public shipmentRowCount = 20;
  public selected = [];
  public holdShipmentArray = [];
  public isAdmin = false;
  public isPartner = false;
  public receivedShipmentArr = [];
  public filteredProducts: any = [];

  constructor(private shipmentNewService: ShipmentNewService, private router: Router) {
    this.getTakeShippedShipment();
    this.getTakeHoldShipment();
    this.takeReceivedShipmentByVendor();
  }

  ngOnInit(): void {
    this.getPartnerOrAdmin();
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  getTakeShippedShipment() {
    let payLoard = {
      vendor_code: sessionStorage.getItem('partnerId')
    };
    this.shipmentNewService.getShipmentByVendorId(payLoard).subscribe(
      data => this.ManageShippedShipment(data),
    );
  }

  // ActiveProductFilter(searchTerm: string): void {
  //   this.filteredProducts = this.list_pages.filter(product =>
  //     product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.title.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }

  ManageShippedShipment(data) {
    this.allShipmentArr = [];
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
        this.allShipmentArr.push(or);
      }
    }
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

  viewShippedShipment(index) {
    let tempCode = this.allShipmentArr[index].shipmentId;
    let url = '/shipment/view-shipment/' + tempCode;
    this.router.navigate([url]);
  }

  viewShippedShipment2(index) {
    let tempCode = this.receivedShipmentArr[index].shipmentId;
    let url = '/shipment/view-shipment/' + tempCode;
    this.router.navigate([url]);
  }

  viewHoldShipment(index) {
    let tempCode = this.holdShipmentArray[index].shipmentId;
    let url = '/shipment/edit-shipment/' + tempCode;
    this.router.navigate([url]);
  }

  getPartnerOrAdmin() {
    const userRole = sessionStorage.getItem('userRole');
    this.isPartner = userRole === 'ROLE_PARTNER';

    this.isAdmin = userRole === 'ROLE_ADMIN';
  }

  takeReceivedShipmentByVendor() {
    let payLoard = {
      vendor_code: sessionStorage.getItem('partnerId')
    };
    this.shipmentNewService.takeReceivedShipmentByVendorId(payLoard).subscribe(
      data => this.manageReceivedShipmentByVendorId(data),
    );
  }

  manageReceivedShipmentByVendorId(data) {
    this.receivedShipmentArr = [];
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
        this.receivedShipmentArr.push(or);
      }
    }
  }
}
