import {Component, inject, Input, OnInit} from '@angular/core';
import {OrderService} from '../../../shared/service/order.service';
import {Router} from '@angular/router';
import {DashboardService} from '../../../shared/service/dashboard.service';
import Swal from 'sweetalert2';
import {OrderMethods} from '../order-methods';
import {DatePipe} from "@angular/common";
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit {
  public isAdmin = false;
  public list_pages = [];
  public list_pages2 = 20;
  public selected = [];
  public part_id = 'non';
  stillLoading = true;

  public businessName = '';
  public names = '';
  public paginateData = [];
  currentSelectedPage = 0;
  totalPages = 0;
  pageIndexes: Array<any> = [];
  page = 0;
  mobile = '';
  status = '';
  ODProducts = false;
  public loading;
  public searchDate = null;
  public dangerStyle = ''
  public today;

  constructor(private orderService: OrderService, private router: Router, private partnerService: DashboardService, private orderMethods: OrderMethods, private datePipe: DatePipe, private ngbCalendar:NgbCalendar, private ngbDateParserFormatter:NgbDateParserFormatter) {
    this.getAllOrders();
    this.getPartner();
    this.hideElement();
    const page = 0;
    const sessionUser2 = sessionStorage.getItem('userRole');
    if (sessionUser2 === 'ROLE_PARTNER') {
      // Simulate data loading from an array
      setTimeout(() => {
        this.getPaginateOrderList(page);
        this.stillLoading = false; // Set loading to false when data is loaded
      }, 2000); // Simulate a 2-second data loading delay

    }
  }

  @Input()
  public talk = [];
  public partner = [];
  public getsession = window.sessionStorage.getItem('partnerId');

  ngOnInit(): void {
      this.today = this.getCurrentDate();
      this.searchDate = this.today
      this.getPaginateOrderList(this.page)
  }

  refreshList(){
    this.searchDate = this.today;
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getToday();
    (document.getElementById('select_od') as HTMLInputElement).value = null,
    this.getPaginateOrderList(this.page - 1)
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  }
  getAllOrders() {
    let resArr = {};
    const productPrefix = [];
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN' || sessionUser === 'ROLE_SUPER_ADMIN') {
      const productPrefix01 = JSON.parse(sessionStorage.getItem('productPrefix'));
      const preLength = productPrefix01.length;
      for (let i = 0; i < preLength; i++) {
        productPrefix[i] = productPrefix01[i];
      }

      resArr = {
        partner_u_id: this.getsession
        // productPrefix
      };


    } else {
      this.loading = true;
      const productPrefix01 = JSON.parse(sessionStorage.getItem('productPrefix'));
      const preLength = productPrefix01.length;
      for (let i = 0; i < preLength; i++) {
        productPrefix[i] = productPrefix01[i];
      }
      resArr = {
        partner_u_id: this.getsession
        // productPrefix
      };
      this.orderService.sendOrders(resArr).subscribe(
        data => {
          this.orderArray(data),
            this.loading = false;
        }
      );
    }
  }

  orderArray(arr) {
    this.list_pages = [];
    var errorMsg = document.getElementById('noOrderMsg');
    var tableContent = document.getElementById('orderDetailsTbl');
    if (arr.data != null) {
      tableContent.style.display = 'table';
      errorMsg.style.display = 'none';
      const orArrLength = arr.data.length;
      for (let i = 0; i < orArrLength; i++) {
        let statusCode = true;
        let statusCode2 = true;

        if (arr.data[i].status === 'IN PROCESS') {
          statusCode = true;
        } else {
          statusCode = false;
        }

        if (arr.data[i].status === 'Delivered') {
          statusCode2 = true;
        } else {
          statusCode2 = false;
        }

        const or = {
          id: arr.data[i].id,
          status: arr.data[i].status,
          status2: statusCode,
          statusCode2,
          shipmentStatus: this.status,
          orderRef: arr.data[i].pnref,
          orderDate: arr.data[i].order_date,
          cartSnapShot: arr.data[i].cartsnapshot[0].name,
          deliveryDate: arr.data[i].delivery_date,
        };
        this.list_pages.push(or);

      }
    } else {
      tableContent.style.display = 'none';
      errorMsg.style.display = 'block';
    }
  }

  getPartner(): void {
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN' || sessionUser === 'ROLE_SUPER_ADMIN') {
      this.orderService.getPartnerAll().subscribe(
        data => this.setPartner(data),
      );
    }
  }

  setPartner(data) {
    let cr = {};
    if (data.data != null) {
      const bussinessPartnerLength = data.data.length;
      for (let i = 0; i < bussinessPartnerLength; i++) {
        cr = {
          name: data.data[i].businessName,
          partner_u_id: data.data[i].partner_u_id,
          mobile: data.data[i].mobile,
        };
        this.partner.push(cr);
      }
    }
  }

  filterList($event) {
    this.dangerStyle = '';
    $event.preventDefault();
    if (this.searchDate === null || this.searchDate === '') {
      this.dangerStyle = 'border-color: red'
      return;
    } else {
      this.getPaginateOrderList(this.page - 1)
    }

  }

  selectPartner() {
    this.part_id = 'non';
    this.mobile = '';
    const id = (document.getElementById('select_od') as HTMLInputElement).value;
    this.part_id = id;
    this.getPaginateOrderList(this.page - 1);
    // this.mobile
    this.loading = true;
    if (id !== 'non') {
      const payload = {
        partner_u_id: id
      };
      this.partnerService.getApprovedPartnerAsLogin(payload).subscribe(
        data => {
          console.log(data)
          this.mobile = data.data.contactNo,
            this.loading = false;
        }
      );
    }

  }

  selectPartnerResponce(data) {

    this.list_pages = [];
    if (data.data != null) {
      const partnerArrayLength = data.data.length;
      for (let i = 0; i < partnerArrayLength; i++) {
        const or = {
          id: data.data[i].id,
          status: data.data[i].status,
          shipTime: data.data[i].ship_time,
          orderRef: data.data[i].pnref,
          orderDate: data.data[i].order_date,
          cartSnapShot: data.data[i].cartsnapshot[0].name,
          deliveryDate: data.data[i].delivery_date,
          shipmentStatus: this.status
        };
        this.list_pages.push(or);
      }
    }
  }

  errorGwtOrderByPartner(error) {
    this.talk = [];
    this.list_pages = [];
  }

  hideElement(): void {
    const role = sessionStorage.getItem('userRole');
    if (role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  paginator(): void {
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  viewOrders(index) {
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      this.part_id = sessionStorage.getItem('partnerId');
    }
    const url = '/orders/view-order/' + index + '/' + this.part_id;
    this.router.navigate([url]);
  }

  getPaginateOrderList(page) {
    let fromDate = null;
    let toDate = null;
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      this.businessName = sessionStorage.getItem('partnerId');
    } else if (sessionStorage.getItem('userRole') === 'ROLE_ADMIN' || sessionStorage.getItem('userRole') === 'ROLE_SUPER_ADMIN') {
      let id = (document.getElementById('select_od') as HTMLInputElement).value;
      this.businessName = id;

      if (this.businessName === '-- Select Vendor --' || this.businessName === null || this.businessName == ''){
        this.businessName = 'none';
      }
    }

    if (this.fromDate !== null && this.fromDate !== undefined){
      fromDate = this.formatNgbDate(this.fromDate)
      toDate = this.toDate === null ? fromDate : this.formatNgbDate(this.toDate)
    }

    console.log(fromDate)
    console.log(toDate)
    console.log(this.fromDate)
    console.log(this.toDate)

    this.orderService.getLimitedOrders(page, this.businessName, this.names, fromDate, toDate, sessionStorage.getItem('userRole')).subscribe(
      data => this.manageLimitedOrders(data),
      error => this.manageErrorLimitedOrders(error)
    );
    this.currentSelectedPage = page;

  }

  manageErrorLimitedOrders(error) {
    this.loading = false;
    console.log(error);
    if (error.error.status_code === 400) {
      this.paginateData = [];
    }
  }

  dateFilter($event) {
    console.log($event)
    if ($event.target.value === '') {
      this.searchDate = $event.target.value = null
    } else {
      this.searchDate = $event.target.value
    }
  }
  calendar = this.ngbCalendar
  formatter = this.ngbDateParserFormatter

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 1);

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;

    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

  }

  formatNgbDate(date: NgbDate): string {
    return date ? `${date.year}-${this.padNumber(date.month)}-${this.padNumber(date.day)}` : '';
  }

  private padNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }


  isHovered(date: NgbDate) {
    return (
        this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
        date.equals(this.fromDate) ||
        (this.toDate && date.equals(this.toDate)) ||
        this.isInside(date) ||
        this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  manageLimitedOrders(data) {
    this.loading = false;
    this.paginateData = [];
    if (data.data.content != null) {
      for (let z = 0; z < data.data.content.length; z++) {
        let statusStyleOne = false;
        let statusStyleTwo = false;
        let statusStyleThree = false;
        let statusStyleFour = false;
        let statusStyleFive = false;
        let statusStyleSix = false;
        let displayStatus = '';

        displayStatus = data.data.content[z].status;
        if (displayStatus === 'IN PROCESS') {
          statusStyleOne = true;
          displayStatus = this.orderMethods.findRealStatus(data.data.content[z].shipmentStatus, data.data.content[z].status, data.data.content[z].purchase_approval_id);

          if (displayStatus === 'READY TO SHIP') {
            statusStyleFour = true;
            statusStyleOne = false;
          }
          if (displayStatus === 'SHIPPED') {
            statusStyleFive = true;
            statusStyleOne = false;
          }
          if (displayStatus === 'SHIPMENT RECEIVED') {
            statusStyleSix = true;
            statusStyleOne = false;
          }
        }

        if (displayStatus === 'Delivered') {
          statusStyleTwo = true;
        }
        if (displayStatus === 'CANCELED') {
          statusStyleThree = true;
        }

        // const proCode = data.data.content[z].cartsnapshot[0].productID;
        let isOnDemand = false;
        if (data.data.content[z].is_od === 1) {
          isOnDemand = true;
          this.ODProducts = true;
        }
        // if (proCode.includes('POD')) {
        //   isOnDemand = true;
        //   this.ODProducts = true;
        // }

        this.getStatus(data.data.content[z].pnref);
        const or = {
          id: data.data.content[z].id,
          status: displayStatus,
          orderRef: data.data.content[z].pnref,
          orderDate: data.data.content[z].order_date,
          statusStyleOne,
          statusStyleTwo,
          statusStyleThree,
          statusStyleFour,
          statusStyleFive,
          statusStyleSix,
          cartsnapshot: data.data.content[z].cartsnapshot[0].name,
          shipmentStatus: this.status,
          isOnDemand,
          delivery_date: data.data.content[z].delivery_date,
        };
        this.paginateData.push(or);
      }

      this.totalPages = data.data.totalElements * 10 / data.data.size;
      // this.totalPages = this.totalPages/20;
      this.pageIndexes = Array(this.totalPages).fill(0).map((x, i) => i);
      this.currentSelectedPage = data.data.number;

    } else {
      this.paginateData = [];
    }
  }

  active(index: number) {
    if (this.currentSelectedPage == index) {
      return {
        active: true
      };
    }
  }

  getSelectedRow(index) {
    this.loading = true;
    this.getPaginateOrderList(index - 1);
  }


  nextClick() {
    if (this.currentSelectedPage < this.totalPages - 1) {
      this.getPaginateOrderList(++this.currentSelectedPage);
    }
  }

  previousClick() {
    if (this.currentSelectedPage > 0) {
      this.getPaginateOrderList(--this.currentSelectedPage);
    }
  }

  getStatus(orderRef): string {
    let resp = '';
    const payload = {
      orderRef,
    };
    this.orderService.getShipmentStatus(payload).subscribe(
      (data) => {
        resp = data.data.toString();
      },
      (error) => {
        resp = '';
      }
    );
    return resp;
  }
}
