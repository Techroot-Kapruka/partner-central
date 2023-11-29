import {Component, OnInit} from '@angular/core';
import {ShipmentNewService} from '../../../shared/service/shipment-new.service';
import * as excel from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-itemwise-shipment-report',
  templateUrl: './itemwise-shipment-report.component.html',
  styleUrls: ['./itemwise-shipment-report.component.scss']
})
export class ItemwiseShipmentReportComponent implements OnInit {

  public shipmentData = [];
  public filteredProducts: any = [];
  public shipmentSearch = '';
  public isSearchRecordEmpty = false;
  public isSearchRecordNotEmpty = true;
  public isLoading = false;
  fromDate: string = new Date().toISOString().split('T')[0];
  toDate: string = new Date().toISOString().split('T')[0];
  today = new Date().toISOString().split('T')[0];
  dateDifference: number = 0;

  constructor(private shipmentNewService: ShipmentNewService) {

  }

  ngOnInit(): void {
  }

  selectAllText(inputElement: HTMLInputElement): void {
    inputElement.select();
  }

  loadDate() {
    const startDate = new Date(this.fromDate);
    const endDate = new Date(this.toDate);

    const timeDifference = endDate.getTime() - startDate.getTime();
    this.dateDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (startDate > endDate) {
      Swal.fire(
        'Warning!',
        'From date must be less than to date.',
        'warning'
      );
      this.fromDate = this.today;
      this.toDate = this.today;
    } else if (this.dateDifference > 35) {
      Swal.fire(
        'Warning!',
        'Please select dates within 35 days.',
        'warning'
      );
      this.fromDate = this.today;
      this.toDate = this.today;
    } else {
      this.isLoading = true;
      this.getShipmentData();
    }
  }

  getShipmentData(): void {
    this.shipmentNewService.getShipmentDetails(this.fromDate, this.toDate).subscribe(
      data => this.manageShipmentDetails(data),
      error => this.mnageError(error)
    );
  }

  mnageError(error) {
    this.isLoading = false;
    Swal.fire(
      'Warning',
      error.message,
      'error'
    );
  }

  private manageShipmentDetails(data: any) {
    this.isLoading = false;
    this.shipmentData = [];
    this.filteredProducts = [];
    if (data.data !== null) {
      for (let i = 0; i < data.data.length; i++) {
        for (let j = 0; j < data.data[i].shipmentItem.length; j++) {
          const payData = {
            shipment_id: data.data[i].shipment_id,
            create_date: data.data[i].create_date,
            businessName: data.data[i].businessName,
            vendor_code: data.data[i].vendor_code,
            product_code: data.data[i].shipmentItem[j].product_code,
            categoryName: data.data[i].shipmentItem[j].categoryName,
            total_quantity: data.data[i].shipmentItem[j].quantity,
            approved_qty: data.data[i].shipmentItem[j].approved_qty,
            rejected_qty: data.data[i].shipmentItem[j].rejected_qty,
            categoryRate: data.data[i].shipmentItem[j].categoryRate,
            cost_price: data.data[i].shipmentItem[j].cost_price,
            selling_price: data.data[i].shipmentItem[j].selling_price,
            approved_amount: data.data[i].shipmentItem[j].approved_amount,
          };
          this.shipmentData.push(payData);
          this.filteredProducts = this.shipmentData;
        }
      }
      this.isSearchRecordEmpty = false;
      this.isSearchRecordNotEmpty = true;
    } else {
      this.shipmentData = [];
      this.filteredProducts = [];
      this.isSearchRecordEmpty = true;
      this.isSearchRecordNotEmpty = false;
      this.fromDate = this.today;
      this.toDate = this.today;
    }
  }

  filterItems(searchTerm: any): void {
    this.filteredProducts = this.shipmentData.filter(shipment =>
      shipment.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.create_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.vendor_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (this.filteredProducts.length === 0) {
      this.isSearchRecordEmpty = true;
      this.isSearchRecordNotEmpty = false;
    } else {
      this.isSearchRecordEmpty = false;
      this.isSearchRecordNotEmpty = true;
    }
  }

  exportToExcel() {
    let filterCategories = [];
    const AllData = [];
    filterCategories = this.shipmentData.filter(shipment =>
      shipment.shipment_id.toLowerCase().includes(this.shipmentSearch.toLowerCase()) ||
      shipment.create_date.toLowerCase().includes(this.shipmentSearch.toLowerCase()) ||
      shipment.businessName.toLowerCase().includes(this.shipmentSearch.toLowerCase()) ||
      shipment.vendor_code.toLowerCase().includes(this.shipmentSearch.toLowerCase()) ||
      shipment.product_code.toLowerCase().includes(this.shipmentSearch.toLowerCase()) ||
      shipment.categoryName.toLowerCase().includes(this.shipmentSearch.toLowerCase())
    );

    // tslint:disable-next-line:one-variable-per-declaration
    let shipmentID = '', shipmentID1 = '', shipmentIDP = '', CreateDate = '', CreateDate1 = '', CreateDateP = '',
      vendorCode = '', vendorCode1 = '', vendorCodeP = '', businessName = '';

    filterCategories.forEach(shipment => {
      shipmentID = shipment.shipment_id;
      shipmentID1 = shipment.shipment_id;
      CreateDate = shipment.create_date;
      CreateDate1 = shipment.create_date;
      vendorCode = shipment.vendor_code;
      vendorCode1 = shipment.vendor_code;
      businessName = shipment.businessName;

      if (shipmentID === shipmentIDP) {
        shipmentID = '';
        if (CreateDate === CreateDateP) {
          CreateDate = '';
          if (vendorCode === vendorCodeP) {
            vendorCode = '';
            businessName = '';
          }
        }
      }

      AllData.push([shipmentID, CreateDate, vendorCode, businessName, shipment.categoryName,
        shipment.product_code, shipment.total_quantity, shipment.approved_qty, shipment.rejected_qty, shipment.categoryRate,
        shipment.cost_price, shipment.selling_price, shipment.approved_amount]);

      shipmentIDP = shipmentID1;
      CreateDateP = CreateDate1;
      vendorCodeP = vendorCode1;
    });

    // Create a worksheet
    const ws: excel.WorkSheet = excel.utils.aoa_to_sheet([['ShipmentID', 'Create Date', 'Supplier Code', 'Supplier', 'Main Category', 'Product Code', 'Total Quantity', 'Approved Quantity', 'Rejected Quantity', 'Category Margin', 'Cost Price', 'Selling Price', 'Approved Amount'], ...AllData]);

    // Create a workbook with the worksheet
    const wb: excel.WorkBook = excel.utils.book_new();
    excel.utils.book_append_sheet(wb, ws, 'Shipment-Report');

    // Save the workbook as an Excel file
    excel.writeFile(wb, 'shipment-report.xlsx');
  }
}
