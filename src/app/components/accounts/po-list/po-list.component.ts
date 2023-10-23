import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import {AccountService} from '../../../shared/service/account.service';

@Component({
  selector: 'app-po-list',
  templateUrl: './po-list.component.html',
  styleUrls: ['./po-list.component.scss']
})
export class PoListComponent implements OnInit {

  public list_pages = [];
  public list_pages2 = 20;
  public messageObjArray = [];
  public filteredMessageObjArray = [];
  public notificationFilter: FormGroup;
  public searchBox: FormControl;
  public poList: any[] = [];
  filteredPoList = [];
  filterStatus = '';
  filterVendorName = '';
  filterPurchaseOrderNo = '';
  filterDate = '';
  isAdmin = false;

  constructor(private accountService: AccountService) {
    this.createFormgroup();
    this.getPoList();
    this.filteredPoList = this.poList;
  }

  ngOnInit(): void {
  }

  createFormgroup() {
    this.searchBox = new FormControl('yyyy-mm-dd');
    this.notificationFilter = new FormGroup({
      searchBox2: this.searchBox,
    });

  }

  applyFilters() {
    if (this.filterStatus || this.filterVendorName || this.filterPurchaseOrderNo || this.filterDate) {
      this.filteredPoList = this.poList.filter(po =>
        po.status.includes(this.filterStatus) &&
        po.vendor_name.includes(this.filterVendorName) &&
        po.purchase_order_no.includes(this.filterPurchaseOrderNo) &&
        po.transaction_date.includes(this.filterDate)
      );
    } else {
      this.filteredPoList = this.poList.slice();
    }
  }

  clearValues() {
    this.searchBox.setValue('');
  }

  searchMessage() {

    const date = this.notificationFilter.get('searchBox2').value;
    if (date === '' || date === 'yyyy-mm-dd') {
      this.filteredMessageObjArray = this.messageObjArray;
    } else {
      this.filteredMessageObjArray = this.filteredMessageObjArray.filter(item => item.create_date_time === date);
    }

  }

  displayMsgBody(i: number) {
    Swal.fire('message', this.filteredMessageObjArray[i].message
    );
  }

  getPoList() {
    let payload = {};
    if (sessionStorage.getItem('userRole') === 'ROLE_ADMIN') {
      this.isAdmin = true;
      payload = {
        type: 'all'
      };
    } else {
      const vendorCode = sessionStorage.getItem('partnerId');
      payload = {
        vendor_code: vendorCode,
        type: 'no'
      };
    }

    this.accountService.getPoList(payload).subscribe(
      data => this.managePoList(data)
    );
  }

  managePoList(data) {

    if (data != null) {
      for (let i = 0; i < data.length; i++) {
        let det;
        det = {
          transaction_date: data[i].transaction_date,
          total: data[i].total,
          vendor_code: data[i].vendor_code,
          vendor_name: data[i].vendor_name,
          purchase_order_no: data[i].purchase_order_no,
          status: data[i].status
        };
        this.poList.push(det);
      }
    }
  }
}


