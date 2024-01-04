import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import {OrderService} from "../../../shared/service/order.service";
import * as excel from "xlsx";

@Component({
  selector: 'app-itemwise-sales-report',
  templateUrl: './itemwise-sales-report.component.html',
  styleUrls: ['./itemwise-sales-report.component.scss']
})
export class ItemwiseSalesReportComponent implements OnInit {

  fromDate: string = new Date().toISOString().split('T')[0];
  toDate: string = new Date().toISOString().split('T')[0];
  today = new Date().toISOString().split('T')[0];
  public isLoading = false;
  public isSearchRecordNotEmpty = true;
  public isSearchRecordEmpty = true;
  public orderData = [];
  public filteredProducts: any = [];
  public itemCount = 0;
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
  }

  loadDate() {
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

  private getOrderDetails() {
    this.orderService.getOrderDetails(this.fromDate, this.toDate).subscribe(
      data => this.manageOrderDetails(data),
      error => this.manageError(error)
    );
  }

  private manageOrderDetails(data: any) {
    this.isLoading = false;
    this.orderData = [];
    this.filteredProducts = [];
    if (data.data !== null) {
      for (let i = 0; i < data.data.length; i++) {
        for (let j = 0; j < data.data[i].items.length; j++) {
          this.itemCount = data.data[i].items.length;
          const payData = {
            vn_no: data.data[i].vn_no,
            item_code: data.data[i].items[j].item_code,
            item_name: data.data[i].items[j].item_name,
            vendor_code: data.data[i].items[j].vendor_code,
            vendor: data.data[i].items[j].vendor,
            category_path: data.data[i].items[j].category_path,
            qty: data.data[i].items[j].qty,
            selling_price: data.data[i].items[j].selling_price,
            cost_price: data.data[i].items[j].cost_price
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
  getRowCount(referenceNumber: string): number {
    let count = 0;
    // Assuming orderData contains your data
    for (const order of this.orderData) {
      if (order.vn_no === referenceNumber) {
        count++;
      }
    }
    return count;
  }


  private manageError(error: any) {
    this.isLoading = false;
    Swal.fire(
      'Warning',
      error.message,
      'error'
    );
  }

  exportToExcel() {
    let filterCategories = [];
    const AllData = [];
    filterCategories = this.orderData
    console.log(filterCategories)

    // tslint:disable-next-line:one-variable-per-declaration

    filterCategories.forEach(order => {




      AllData.push([order.vn_no,
        order.item_code, order.item_name, order.category_path, order.vendor_code, order.vendor,
        order.cost_price, order.selling_price, order.qty]);

    });

    // Create a worksheet
    const ws: excel.WorkSheet = excel.utils.aoa_to_sheet([['Ref No', 'Product Code', 'Product Name', 'Category Path', 'Supplier Code', 'Supplier', 'Cost Price', 'Selling Price', 'Quantity'], ...AllData]);

    // Create a workbook with the worksheet
    const wb: excel.WorkBook = excel.utils.book_new();
    excel.utils.book_append_sheet(wb, ws, 'Sales-Report');

    // Save the workbook as an Excel file
    excel.writeFile(wb, 'sales-report.xlsx');
  }
}
