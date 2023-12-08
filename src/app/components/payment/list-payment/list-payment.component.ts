import {Component, OnInit} from '@angular/core';
import {PaymentService} from '../../../shared/service/payment.service';
import {OrderService} from '../../../shared/service/order.service';

@Component({
  selector: 'app-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss']
})
export class ListPaymentComponent implements OnInit {
  public isAdmin: boolean = false;
  public list_pages = [];
  public list_pages2 = 5;
  public selected = [];
  public names = '';
  public postingDate = '';
  public total = '';
  public statuss = '';
  public supplier = '';
  public supplierName = '';


  public partner = [];

  constructor(private paymentService: PaymentService, private orderService: OrderService) {
    this.getAllPaymentDetails();
    this.hideElement();
    this.getPartner();
  }


  ngOnInit(): void {
  }

  getAllPaymentDetails() {
    const arr = {
      partner_u_id: sessionStorage.getItem('partnerId')
    };

    this.paymentService.callPaymentEndpoint(arr).subscribe(
      data => this.managePaymentResponce(data),
    );

  }

  hideElement(): void {
    let role = sessionStorage.getItem('userRole');
    if (role === 'ROLE_ADMIN') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  managePaymentResponce(response) {
    // const name: string = keyArr[0];
    const valuesArrayLength = response.message.values.length;
    const keyArr = response.message.keys;
    const name: string = keyArr[0];
    this.names = name;
    const postingDates: string = keyArr[1];
    this.postingDate = postingDates;
    const totals: string = keyArr[2];
    this.total = totals;
    const status: string = keyArr[3];
    this.statuss = status;
    const suppliers: string = keyArr[4];
    this.supplier = suppliers;
    const supplierNames: string = keyArr[5];
    this.supplierName = supplierNames;

    let payArr2 = [];
    for (let i = 0; i < valuesArrayLength; i++) {
      const payArr = {
        invoiceNo: response.message.values[i][0],
        postingDate: response.message.values[i][1],
        totalAmount: response.message.values[i][2],
        currentStatus: response.message.values[i][3],
        supplierCode: response.message.values[i][4],
        supplierName: response.message.values[i][5]
      };
      payArr2.push(payArr);
      this.list_pages = payArr2;
    }
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

  }

  getPartner(): void {
    let sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN') {
      this.orderService.getPartnerAll().subscribe(
        data => this.setPartner(data),
      );
    }
  }

  setPartner(data) {
    let cr = {};
    let bussinessPartnerLength = data.data.length;
    for (let i = 0; i < bussinessPartnerLength; i++) {
      cr = {
        name: data.data[i].businessName,
        value: data.data[i].partner_u_id
      };
      this.partner.push(cr);
    }
  }

  selectPartner() {
    let bussiness = {};
    let id = (document.getElementById('select_od') as HTMLInputElement).value;
    bussiness = {
      partner_u_id: id
    };

    let sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN') {
      this.paymentService.getPaymentByBussiness(bussiness).subscribe(
        data => this.managePaymentDetails(data),
      );
    }
  }

  managePaymentDetails(response) {
    this.list_pages = [];
    const valuesArrayLength = response.message.values.length;
    const keyArr = response.message.keys;
    const name: string = keyArr[0];
    this.names = name;
    const postingDates: string = keyArr[1];
    this.postingDate = postingDates;
    const totals: string = keyArr[2];
    this.total = totals;
    const status: string = keyArr[3];
    this.statuss = status;
    const suppliers: string = keyArr[4];
    this.supplier = suppliers;
    const supplierNames: string = keyArr[5];
    this.supplierName = supplierNames;

    let payArr2 = [];
    for (let i = 0; i < valuesArrayLength; i++) {
      const payArr = {
        invoiceNo: response.message.values[i][0],
        postingDate: response.message.values[i][1],
        totalAmount: response.message.values[i][2],
        currentStatus: response.message.values[i][3],
        supplierCode: response.message.values[i][4],
        supplierName: response.message.values[i][5]
      };
      payArr2.push(payArr);
      this.list_pages = payArr2;
    }
  }
}
