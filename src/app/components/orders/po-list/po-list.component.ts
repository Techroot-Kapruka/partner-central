import {Component, Input, OnInit} from '@angular/core';
import {OrderService} from "../../../shared/service/order.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-po-list',
  templateUrl: './po-list.component.html',
  styleUrls: ['./po-list.component.scss']
})
export class PoListComponent implements OnInit {
  public isAdmin = false;
  public list_od_pages = [];
  public list__od_pages2 = 20;
  public selected = [];
  public part_id = 'non';

  public businessName = '';
  public names = '';
  public paginateDataOD = [];
  currentSelectedPage = 0;
  totalPages = 0;
  pageIndexes: Array<any> = [];
  page = 0;

  constructor(private orderService: OrderService, private router: Router) {
    this.getAllOrdersOD();
    this.getPartner();
    this.hideElement();
    const page = 0;
    const sessionUser2 = sessionStorage.getItem('userRole');
    if (sessionUser2 === 'ROLE_PARTNER') {
      this.getPaginateOrderList(page);
    }
  }

  @Input()
  public talk = [];
  public partner = [];
  public getsession = window.sessionStorage.getItem('partnerId');

  ngOnInit(): void {
  }

  getAllOrdersOD() {
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
        partner_u_id: sessionStorage.getItem('partnerId')
        // productPrefix
      };
    } else {
      const productPrefix01 = JSON.parse(sessionStorage.getItem('productPrefix'));
      const preLength = productPrefix01.length;
      for (let i = 0; i < preLength; i++) {
        productPrefix[i] = productPrefix01[i];
      }
      resArr = {
        partner_u_id: sessionStorage.getItem('partnerId')
        // productPrefix
      };
      this.orderService.sendODOrders(resArr).subscribe(
        data => this.odorderArray(data),
      );
    }
  }

  odorderArray(arr) {
    this.list_od_pages = [];
    if (arr.data != null) {
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
          shipTime: arr.data[i].ship_time,
          orderRef: arr.data[i].pnref,
          orderDate: arr.data[i].order_date,
          cartSnapShot: arr.data[i].cartsnapshot[0].name,
          deliveryDate: arr.data[i].delivery_date
        };
        this.list_od_pages.push(or);
      }
    } else {
      this.list_od_pages = [];
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
          partner_u_id: data.data[i].partner_u_id
        };
        this.partner.push(cr);
      }
    }
  }

  selectPartner() {
    this.part_id = 'non';
    const id = (document.getElementById('select_od') as HTMLInputElement).value;
    this.part_id = id;
    this.getPaginateOrderList(this.page - 1);


  }

  selectPartnerResponce(data) {

    this.list_od_pages = [];
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
          deliveryDate: data.data[i].delivery_date
        };
        this.list_od_pages.push(or);
      }
    }
  }

  errorGwtOrderByPartner(error) {
    this.talk = [];
    this.list_od_pages = [];
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
    } else if (sessionStorage.getItem('userRole') === 'ROLE_ADMIN' || sessionStorage.getItem('userRole') === 'ROLE_SUPER_ADMIN') {
      let id = (document.getElementById('select_od') as HTMLInputElement).value;

      this.businessName = id;
    }
    this.orderService.ordersODByPrefixInPage(page, this.businessName, this.names).subscribe(
      data => this.manageLimitedOrders(data),
    );
    this.currentSelectedPage = page;

  }

  manageLimitedOrders(data) {
    this.paginateDataOD = [];
    if (data.data.content != null) {
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

        const or = {
          id: data.data.content[z].id,
          status: data.data.content[z].status,
          orderRef: data.data.content[z].pnref,
          orderDate: data.data.content[z].order_date,
          statusStyleOne: statusStyleOne,
          statusStyleTwo: statusStyleTwo,
          cartsnapshot: data.data.content[z].cartsnapshot[0].name,
          delivery_date: data.data.content[z].delivery_date,
        };
        this.paginateDataOD.push(or);
      }

      this.totalPages = data.data.totalElements * 10 / data.data.size;
      // this.totalPages = this.totalPages/20;
      this.pageIndexes = Array(this.totalPages).fill(0).map((x, i) => i);
      this.currentSelectedPage = data.data.number;

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

}
