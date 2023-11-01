import {Component, Input, OnInit} from '@angular/core';
import {OrderService} from '../../../shared/service/order.service';
import {Router} from '@angular/router';
import {DashboardService} from '../../../shared/service/dashboard.service';
import Swal from 'sweetalert2';

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

  constructor(private orderService: OrderService, private router: Router, private partnerService: DashboardService) {
    this.getAllOrders();
    this.getPartner();
    this.hideElement();
    const page = 0;
    const sessionUser2 = sessionStorage.getItem('userRole');
    console.log('user : ' + sessionUser2)
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
  }

  getAllOrders() {
    let resArr = {};
    const productPrefix = [];
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN') {
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
        data =>{
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
      tableContent.style.display='table';
      errorMsg.style.display='none';
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
      tableContent.style.display='none';
      errorMsg.style.display='block';
    }
  }

  getPartner(): void {
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN') {
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

  selectPartner() {
    this.part_id = 'non';
    this.mobile = '';
    const id = (document.getElementById('select_od') as HTMLInputElement).value;
    this.part_id = id;
    this.getPaginateOrderList(this.page - 1);
    // this.mobile
    this.loading=true;
    if (id !== 'non') {
      const payload = {
        partner_u_id: id
      };
      this.partnerService.getApprovedPartnerAsLogin(payload).subscribe(
        data =>{
          console.log(data)
          this.mobile = data.data.contactNo,
            this.loading=false; }
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
    if (role === 'ROLE_ADMIN') {
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
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      this.businessName = sessionStorage.getItem('partnerId');
    } else if (sessionStorage.getItem('userRole') === 'ROLE_ADMIN') {
      let id = (document.getElementById('select_od') as HTMLInputElement).value;

      this.businessName = id;
    }
    this.orderService.getLimitedOrders(page, this.businessName, this.names).subscribe(
      data => this.manageLimitedOrders(data),
      error => this.manageErrorLimitedOrders(error)
    );
    this.currentSelectedPage = page;

  }
  manageErrorLimitedOrders(error){
    console.log(error);
    if(error.error.status_code === 400){
      this.paginateData = [];
    }
  }

  manageLimitedOrders(data) {
    this.paginateData = [];
    if (data.data.content != null) {
      this.loading = false;
      for (let z = 0; z < data.data.content.length; z++) {
        let statusStyleOne = false;
        let statusStyleTwo = false;
        if (data.data.content[z].status === 'IN PROCESS') {
          statusStyleOne = true;
        } else {
          statusStyleOne = false;
        }

        if (data.data.content[z].status === 'Delivered') {
          statusStyleTwo = true;
        } else {
          statusStyleTwo = false;
        }
        // const proCode = data.data.content[z].cartsnapshot[0].productID;
        let isOnDemand = false;
        if(data.data.content[z].is_od === 1){
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
          status: data.data.content[z].status,
          orderRef: data.data.content[z].pnref,
          orderDate: data.data.content[z].order_date,
          statusStyleOne,
          statusStyleTwo,
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

    }else{
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
