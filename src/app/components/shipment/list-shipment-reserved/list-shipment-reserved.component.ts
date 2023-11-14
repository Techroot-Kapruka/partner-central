import {Component, OnInit} from '@angular/core';
import {ShipmentNewService} from '../../../shared/service/shipment-new.service';
import {Router} from '@angular/router';
import {ProductService} from '../../../shared/service/product.service';
import Swal from 'sweetalert2';
import {PriceChangeService} from '../../../shared/service/price-change.service';

@Component({
  selector: 'app-list-shipment-reserved',
  templateUrl: './list-shipment-reserved.component.html',
  styleUrls: ['./list-shipment-reserved.component.scss']
})

export class ListShipmentReservedComponent implements OnInit {
  public shipment_list = [];
  public shipmentRowCount = 20;
  public priceChangeCount = 20;
  public selected = [];
  public isAdmin = false;
  public isRecievedShipmentValid = false;
  public recievedShipmentErrorMsg = false;

  public partnerArray = [];
  public recivedShipmentArray = [];
  public changePriceArray = [];

  constructor(private shipmentNewService: ShipmentNewService, private router: Router,
              private productService: ProductService, private priceChangeService: PriceChangeService) {

    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN' || sessionUser === 'ROLE_SUPER_ADMIN' || sessionUser === 'ROLE_STORES_MANAGER') {
      this.isAdmin = true;
    }

    this.getPartner();
    this.getTakeChangePriceProduct();
    this.getSelectedPartnerReceviedShipmentList();
  }

  ngOnInit(): void {
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  getTakeChangePriceProduct() {
    if (this.isAdmin) {
      this.priceChangeService.getAllTakeChangeProductPriceList().subscribe(
        data => this.TakePriceChangesAll(data),
      );
    } else {
      const payload = {
        vendor_code: sessionStorage.getItem('partnerId')
      };
      this.priceChangeService.getAllPendingApprovalPriceChangeListByVendor(payload).subscribe(
        data => this.TakePriceChangesAll(data),
      );
    }
  }

  TakePriceChangesAll(data) {
    this.changePriceArray = [];
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        let obj = {
          changeId: data.data[i].changeId,
          createDate: data.data[i].createDate,
          productCode: data.data[i].productCode,
          productName: data.data[i].productName,
          oldCostPrice: data.data[i].oldCostPrice.toFixed(2),
          newCostPrice: data.data[i].newCostPrice.toFixed(2),
          oldSellingPrice: data.data[i].oldSellingPrice.toFixed(2),
          newSellingPrice: data.data[i].newSellingPrice,
          Action: ''
        };
        this.changePriceArray.push(obj);
      }
      this.changePriceArray.sort((a, b) => {
        return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
      });
    }
  }

  getPartner(): void {
    if (this.isAdmin === true) {
      this.productService.getPartnerAll().subscribe(
        data => this.manageBussinessPartner(data),
      );
    }
  }

  manageBussinessPartner(data) {
    let pr = {};
    const bussinessArrLangth = data.data.length;
    const partnerValue = data.data;
    for (let i = 0; i < bussinessArrLangth; i++) {
      pr = {
        name: partnerValue[i].businessName,
        value: partnerValue[i].partner_u_id
      };
      this.partnerArray.push(pr);
    }
  }

  getSelectedPartnerRecivedShipment() {
      const name = (document.getElementById('select_pro2') as HTMLInputElement).value;
      const bussArr = {
        vendor_code: name
      };
      this.shipmentNewService.getRecivedShipmentByVendorId(bussArr).subscribe(
        data => this.managRecivedShipmetAll(data),
      );
  }

  getSelectedPartnerReceviedShipmentList() {
    if (this.isAdmin) {
      this.shipmentNewService.takeReceivedShipment().subscribe(
        data => this.managRecivedShipmetAll(data),
      );
    }else{
      const name = sessionStorage.getItem('partnerId');
      const bussArr = {
        vendor_code: name
      };
      this.shipmentNewService.getRecivedShipmentByVendorId(bussArr).subscribe(
        data => this.managRecivedShipmetAll(data),
      );
    }
  }

  getSelectedPartnerPriceChange() {
    const name = (document.getElementById('select_pro3') as HTMLInputElement).value;
    const obj = {
      vendor_code: name
    };
    this.priceChangeService.getAllPendingApprovalPriceChangeListByVendor(obj).subscribe(
      data => this.managePriceChangesAll(data),
    );
  }

  managRecivedShipmetAll(data) {
    this.recivedShipmentArray = [];
    if (data.data != null) {
      this.isRecievedShipmentValid = true;
      this.recievedShipmentErrorMsg = false;
      for (let i = 0; i < data.data.length; i++) {
        let or = {
          shipmentId: data.data[i].shipment_id,
          businessName: data.data[i].businessName,
          createDate: data.data[i].create_date,
          totalQuantity: data.data[i].total_quantity,
          approvedQuantity: data.data[i].approved_all_qty,
          approvedAmount: data.data[i].approved_amount.toFixed(2),
          grossAmount: data.data[i].gross_amount.toFixed(2),
          received: data.data[i].is_receive,
          Action: ''
        };
        this.recivedShipmentArray.push(or);
      }
      this.recivedShipmentArray.sort((a, b) => {
        return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
      });
    } else {
      this.isRecievedShipmentValid = false;
      this.recievedShipmentErrorMsg = true;
    }
  }

  managePriceChangesAll(data) {
    this.changePriceArray = [];
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        let obj = {
          changeId: data.data[i].changeId,
          createDate: data.data[i].createDate,
          productCode: data.data[i].productCode,
          productName: data.data[i].productName,
          oldCostPrice: data.data[i].oldCostPrice.toFixed(2),
          newCostPrice: data.data[i].newCostPrice.toFixed(2),
          oldSellingPrice: data.data[i].oldSellingPrice.toFixed(2),
          newSellingPrice: data.data[i].newSellingPrice,
          Action: ''
        };
        this.changePriceArray.push(obj);
      }
    }
  }

  viewRecivedShipment(index) {
    let tempCode = this.recivedShipmentArray[index].shipmentId;
    let url = '/shipment/view-shipment/' + tempCode;
    this.router.navigate([url]);
  }

  approvedChangePrice(index) {
    let priceChangeId = this.changePriceArray[index].changeId;
    let user = sessionStorage.getItem('userId');
    let obj = {
      priceChangeId: priceChangeId,
      user: user
    }
    this.priceChangeService.approvedChangePrice(obj).subscribe(
      data => this.manageApproveChangePrice(data),
      error => this.errorApprovalManage(error)
    );
  }

  manageApproveChangePrice(data) {
    Swal.fire(
      'Good job!',
      data.message,
      'success'
    );
    let url = 'shipment/receive-shipment';
    this.router.navigate([url]);
    window.location.reload();
  }

  errorApprovalManage(error) {
    Swal.fire(
      'Oops...',
      error.message,
      'error'
    );
  }
}
