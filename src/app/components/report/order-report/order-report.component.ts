import { Component, OnInit } from '@angular/core';
import {OrderService} from "../../../shared/service/order.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss']
})
export class OrderReportComponent implements OnInit {

  fromDate: string = new Date().toISOString().split('T')[0];
  toDate: string = new Date().toISOString().split('T')[0];
  today = new Date().toISOString().split('T')[0];
  public isLoading = false;
  public isSearchRecordNotEmpty = true;
  public isSearchRecordEmpty = true;
  public orderData = [];
  public filteredProducts: any = [];
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
  }

  loadDate(){
    const startDate = new Date(this.fromDate);
    const endDate = new Date(this.toDate);

    if (startDate > endDate) {
      Swal.fire(
        'Warning!',
        'From date must be less than to date.',
        'warning'
      );
      this.fromDate = this.today;
      this.toDate = this.today;
    } else {
      this.isLoading = true;
      this.getOrderDetails();
    }
  }
  getOrderDetails(){
    const obj ={
      userRole : sessionStorage.getItem('userRole'),
      fromDate : this.fromDate,
      toDate : this.toDate
    }
    this.orderService.getOrderReport(obj).subscribe(
      data => this.manageOrderDetails(data),
      error => this.manageError(error)
    );
  }


  exportToExcel(){

  }


  private manageOrderDetails(data: any) {
    this.isLoading = false;
    this.orderData = [];
    this.filteredProducts = [];
    if (data.data !== null) {
      for (let i = 0; i < data.data.length; i++) {
        for (let j = 0; j < data.data[i].cartsnapshot.length; j++) {


          const payData = {
            vn_no: data.data[i].pnref,
            item_code: data.data[i].cartsnapshot[j].productID,
            item_name: data.data[i].cartsnapshot[j].name,
            vendor_code: data.data[i].cartsnapshot[j].vendor,
            vendor: data.data[i].cartsnapshot[j].vendor_name,
            // category_path: data.data[i].items[j].category_path,
            qty: data.data[i].cartsnapshot[j].size,
            selling_price: data.data[i].cartsnapshot[j].selling_price,
            cost_price: data.data[i].cartsnapshot[j].cost_price,
            order_date :data.data[i].order_date,
            delivery_date :data.data[i].delivery_date,
            status :data.data[i].status
          };



          this.orderData.push(payData);
          this.filteredProducts = this.orderData;
        }
      }
      this.isSearchRecordEmpty = false;
      this.isSearchRecordNotEmpty = true;
    } else {
      this.orderData = [];
      this.filteredProducts = [];
      this.isSearchRecordEmpty = true;
      this.isSearchRecordNotEmpty = false;
      this.fromDate = this.today;
      this.toDate = this.today;
    }
  }

  private manageError(error: any) {
    this.isLoading = false;
    Swal.fire(
      'Warning',
      error.message,
      'error'
    );
  }
}
