import {HostListener, Inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {WINDOW} from './windows.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';
import {Router} from '@angular/router';


// Menu
export interface Menu {
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: 'root'
})
export class NavService {


  public tempCode = sessionStorage.getItem('temp_code');
  SERVER = '';

  constructor(@Inject(WINDOW) private window, private httpClient: HttpClient, private router: Router) {
    this.SERVER = environment.baseURL;
    this.onResize();
    if (this.screenWidth < 991) {
      this.collapseSidebar = true;
    }
    if (sessionStorage.length == 0) {
      this.router.navigate(['/auth/login']);
    }
  }

  public screenWidth: any;
  public collapseSidebar = false;
  MENUITEMS: Menu[] = [{
    path: '/dashboard/default',
    title: 'Dashboard',
    icon: 'home',
    type: 'link',
    badgeType: 'primary',
    active: false
  },
    {
      title: 'Category',
      path: 'category/category',
      icon: 'log-in',
      type: 'link',
      active: false
    },
    {
      title: 'Products',
      icon: 'box',
      type: 'sub',
      active: false,
      children: [
        {path: '/products/digital/product-search', title: 'Product Search', type: 'link'},
        {path: '/products/digital/digital-product-list', title: 'Product List', type: 'link'},
        {path: '/products/digital/digital-add-product', title: 'Add Product', type: 'link'},

        {path: '/filess/file', title: 'Bulk upload', type: 'link'},

        // new Added thingsss
        {path: '/products/digital/new-additions', title: 'New Additions', type: 'link'},
        {path: '/products/digital/change-requests', title: 'Change Requests', type: 'link'},

        // {path: '/products/digital/edit-image-approval', title: 'Edit Image Approval', type: 'link'},
        // {path: '/products/digital/out-of-stock', title: 'Out Of Stock', type: 'link'},
        // {path: '/products/digital/suspended', title: 'Suspended', type: 'link'},
        // {path: '/products/digital/on-demand', title: 'On Demand', type: 'link'},

      ]
    },
    {
      title: 'Orders',
      icon: 'archive',
      type: 'sub',
      active: false,
      children: [
        {path: '/orders/list-orders', title: 'Order List', type: 'link'}
      ]
    },
    {
      title: 'Payments',
      icon: 'dollar-sign',
      type: 'sub',
      active: false,
      children: [
        {path: '/payment/list-payment', title: 'Payment List', type: 'link'}
      ]
    },
    {
      title: 'Shipments',
      icon: 'tag',
      type: 'sub',
      active: false,
      children: [
        {path: '/shipment/receive-shipment', title: 'Shipment List', type: 'link'},
        {path: '/shipment/list-pending-shipment', title: 'Pending Shipments', type: 'link'},
        // {path: '/shipment/list-hold-shipment', title: 'Hold Shipments', type: 'link'},
        {path: '/shipment/add-shipment', title: 'Shipment Add', type: 'link'},
        {path: '/shipment/receive-shipment', title: 'Shipment Receive List', type: 'link'}
      ]
    },
    {
      title: 'Users',
      icon: 'user-plus',
      type: 'sub',
      active: false,
      children: [
        {path: '/users/create-user', title: 'Create User', type: 'link'},
        {path: '/users/list-user', title: 'User List', type: 'link'},
        {path: '/users/users-privileges', title: 'User Privileges', type: 'link'}
        // {path: '/users/list-update', title: 'User Update', type: 'link'}
      ]
    },
    {
      title: 'Business Information',
      path: '/users/guest',
      icon: 'log-in',
      type: 'link',
      active: false
    }
    ,
    {
      title: 'Request Category',
      path: 'users/edit-partner-category/' + this.tempCode,
      icon: 'grid',
      type: 'link',
      active: false
    },
    {
      title: 'Notification',
      path: 'users/user-notifications',
      icon: 'bell',
      type: 'link',
      active: false
    },
    {
      title: 'Accounts',
      icon: 'dollar-sign',
      type: 'sub',
      active: false,
      children: [
        {path: '/po-list/po-list-list', title: 'Purchase Order List', type: 'link'}
      ]
    },
    {
      title: 'Reports',
      icon: 'list',
      type: 'sub',
      active: false,
      children: [
        {path: '/report/category-report', title: 'Category Report', type: 'link'},
        {path: '/report/product-report', title: 'Product Report', type: 'link'},
        {path: '/report/supplier-report', title: 'Supplier Report', type: 'link'},
        {path: '/products/digital/analytics-product-view', title: 'Product Analytics', type: 'link'},
      ]
    },

  ];


  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

// Windows width
  @HostListener('window:resize', ['$event'])
  onResize(event?) {

    let userInSession = sessionStorage.getItem('userRole');

    if (userInSession === 'ROLE_PARTNER') {
      let dashBordArrLength4 = this.items.value.length;

      for (let i = 0; i < dashBordArrLength4 - 1; i++) {
        if (this.items.value[6].title === 'Users') {
          this.items.value.splice(6, 1);
        }
      }

      let dashBordArrLength = this.items.value.length;
      for (let i = 0; i < dashBordArrLength - 1; i++) {
        if (this.items.value[6].title === 'Guest') {
          this.items.value.splice(6, 1);
        }
      }

      let dashBordArrLength2 = this.items.value.length;
      for (let i = 0; i < dashBordArrLength2 - 1; i++) {
        if (this.items.value[1].title === 'Category') {
          this.items.value.splice(1, 1);
        }
      }


      let dashBordArrLength3 = this.items.value.length;
      for (let i = 0; i < dashBordArrLength3 - 1; i++) {
        this.items.value[4].children[3].path = '';
        this.items.value[4].children[3].title = '';
        this.items.value[4].children[3].type = '';

      }

    } else if (userInSession === 'ROLE_GUEST') {

    }
    this.screenWidth = window.innerWidth;
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      this.testWork();
    } else if (sessionStorage.getItem('userRole') === 'ROLE_QA' || sessionStorage.getItem('userRole') === 'ROLE_USER') {
      this.qaPrivileges();
    } else if (sessionStorage.getItem('userRole') === 'ROLE_GUEST') {
      this.manageGuest();
    } else if (sessionStorage.getItem('userRole') === 'ROLE_CATEGORY_MANAGER') {
      this.manageCategoryManager();
    } else if (sessionStorage.getItem('userRole') === 'ROLE_STORES_MANAGER') {
      this.manageStoresManager();
    } else if (sessionStorage.getItem('userRole') === 'ROLE_ADMIN') {
      this.manageAdmin();
    } else if (sessionStorage.getItem('userRole') === 'ROLE_PURCHASING_MANAGER') {
      this.managePurchasingManager();
    } else if (sessionStorage.getItem('userRole') === 'ROLE_PURCHASING_USER') {
      this.managePurchasingUser();
    } else if (sessionStorage.getItem('userRole') === 'ROLE_FINANCE_USER') {
      this.manageFinanceUser();
    } else if (sessionStorage.getItem('userRole') === 'ROLE_SUPER_ADMIN') {
      this.manageSuperAdmin();
    }
  }

  managePurchasingManager() {

    this.items.value[1].icon = '';
    this.items.value[1].title = '';
    this.items.value[1].type = '';
    this.items.value[1].icon = '';
    this.items.value[1].title = '';
    this.items.value[1].type = '';
    this.items.value[1].active = false;

    this.items.value[2].children[0].path = '';
    this.items.value[2].children[0].title = '';
    this.items.value[2].children[0].type = '';
    this.items.value[2].icon = '';
    this.items.value[2].title = '';
    this.items.value[2].type = '';

    this.items.value[3].icon = '';
    this.items.value[3].title = '';
    this.items.value[3].type = '';
    this.items.value[3].active = false;
    this.items.value[3].children[0].path = '';
    this.items.value[3].children[0].title = '';
    this.items.value[3].children[0].type = '';


    this.items.value[4].icon = '';
    this.items.value[4].title = '';
    this.items.value[4].type = '';
    this.items.value[4].active = false;
    this.items.value[4].children[0].path = '';
    this.items.value[4].children[0].title = '';
    this.items.value[4].children[0].type = '';


    this.items.value[5].icon = '';
    this.items.value[5].title = '';
    this.items.value[5].type = '';
    this.items.value[5].active = false;

    this.items.value[5].children[0].path = '';
    this.items.value[5].children[0].title = '';
    this.items.value[5].children[0].type = '';

    this.items.value[5].children[1].path = '';
    this.items.value[5].children[1].title = '';
    this.items.value[5].children[1].type = '';

    this.items.value[5].children[2].path = '';
    this.items.value[5].children[2].title = '';
    this.items.value[5].children[2].type = '';

    this.items.value[5].children[3].path = '';
    this.items.value[5].children[3].title = '';
    this.items.value[5].children[3].type = '';

    this.items.value[6].icon = '';
    this.items.value[6].title = '';
    this.items.value[6].type = '';
    this.items.value[6].active = false;
    this.items.value[6].children[0].path = '';
    this.items.value[6].children[0].title = '';
    this.items.value[6].children[0].type = '';

    this.items.value[7].icon = '';
    this.items.value[7].title = '';
    this.items.value[7].type = '';
    this.items.value[7].active = false;

    this.items.value[8].icon = '';
    this.items.value[8].title = '';
    this.items.value[8].type = '';
    this.items.value[8].active = false;

    this.items.value[9].icon = '';
    this.items.value[9].title = '';
    this.items.value[9].type = '';
    this.items.value[9].active = false;

    this.items.value[10].icon = '';
    this.items.value[10].title = '';
    this.items.value[10].type = '';
    this.items.value[10].active = false;
    this.items.value[10].children[0].path = '';
    this.items.value[10].children[0].title = '';
    this.items.value[10].children[0].type = '';

    this.items.value[11].icon = '';
    this.items.value[11].title = '';
    this.items.value[11].type = '';
    this.items.value[11].active = false;
    this.items.value[11].children[0].path = '';
    this.items.value[11].children[0].title = '';
    this.items.value[11].children[0].type = '';

  }

  managePurchasingUser() {

    this.items.value[2].children[1].path = '';
    this.items.value[2].children[1].title = '';
    this.items.value[2].children[1].type = '';

    this.items.value[2].children[2].path = '';
    this.items.value[2].children[2].title = '';
    this.items.value[2].children[2].type = '';

    this.items.value[4].path = '';
    this.items.value[4].title = '';
    this.items.value[4].type = '';

    this.items.value[5].children[2].path = '';
    this.items.value[5].children[2].title = '';
    this.items.value[5].children[2].type = '';

    this.items.value[5].children[3].path = '';
    this.items.value[5].children[3].title = '';
    this.items.value[5].children[3].type = '';

    this.items.value[7].icon = '';
    this.items.value[7].title = '';
    this.items.value[7].type = '';

    this.items.value[8].icon = '';
    this.items.value[8].title = '';
    this.items.value[8].type = '';

    this.items.value[9].icon = '';
    this.items.value[9].title = '';
    this.items.value[9].type = '';

  }

  manageAdmin() {
    console.log(this.items)

    //category
    this.items.value[1].path = '';
    this.items.value[1].title = '';
    this.items.value[1].type = '';

    //create user hide
    this.items.value[6].children[0].path = '';
    this.items.value[6].children[0].title = '';
    this.items.value[6].children[0].type = '';

    this.items.value[2].children[3].path = '';
    this.items.value[2].children[3].title = '';
    this.items.value[2].children[3].type = '';

    this.items.value[2].children[2].path = '';
    this.items.value[2].children[2].title = '';
    this.items.value[2].children[2].type = '';


    this.items.value[4].path = '';
    this.items.value[4].title = '';
    this.items.value[4].type = '';

    this.items.value[5].children[2].path = '';
    this.items.value[5].children[2].title = '';
    this.items.value[5].children[2].type = '';

    this.items.value[5].children[3].path = '';
    this.items.value[5].children[3].title = '';
    this.items.value[5].children[3].type = '';

    this.items.value[7].icon = '';
    this.items.value[7].title = '';
    this.items.value[7].type = '';

    this.items.value[8].icon = '';
    this.items.value[8].title = '';
    this.items.value[8].type = '';

    this.items.value[9].icon = '';
    this.items.value[9].title = '';
    this.items.value[9].type = '';

    // this.items.value[11].children[3].path = '';
    // this.items.value[11].children[3].title = '';
    // this.items.value[11].children[3].type = '';


    // this.items.value[12].icon = '';
    // this.items.value[12].title = '';
    // this.items.value[12].type = '';

    // this.items.value[13].icon = '';
    // this.items.value[13].title = '';
    // this.items.value[13].type = '';

  }

  manageSuperAdmin() {

    console.log(this.items);
    this.items.value[2].children[3].path = '';
    this.items.value[2].children[3].title = '';
    this.items.value[2].children[3].type = '';
    //
    this.items.value[2].children[2].path = '';
    this.items.value[2].children[2].title = '';
    this.items.value[2].children[2].type = '';

    this.items.value[4].path = '';
    this.items.value[4].title = '';
    this.items.value[4].type = '';

    this.items.value[5].children[2].path = '';
    this.items.value[5].children[2].title = '';
    this.items.value[5].children[2].type = '';

    this.items.value[5].children[3].path = '';
    this.items.value[5].children[3].title = '';
    this.items.value[5].children[3].type = '';

    this.items.value[7].icon = '';
    this.items.value[7].title = '';
    this.items.value[7].type = '';

    this.items.value[8].icon = '';
    this.items.value[8].title = '';
    this.items.value[8].type = '';

    this.items.value[9].icon = '';
    this.items.value[9].title = '';
    this.items.value[9].type = '';

    // this.items.value[12].icon = '';
    // this.items.value[12].title = '';
    // this.items.value[12].type = '';

    // this.items.value[13].icon = '';
    // this.items.value[13].title = '';
    // this.items.value[13].type = '';

  }

  testWork() {
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {

      let payloard = {
        partner_u_id: sessionStorage.getItem('partnerId')
      };
      this.getDetails(payloard).subscribe(
        data => this.partnerPrivilegeItem(data)
      );
    }
  }

  partnerPrivilegeItem(data) {
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      //hide bulk upload
      if (sessionStorage.getItem('partnerId') !== 'PC00003'){
        this.items.value[1].children[3].path = '';
        this.items.value[1].children[3].title = '';
        this.items.value[1].children[3].type = '';
      }

      // hide change Requests
      this.items.value[1].children[5].path = '';
      this.items.value[1].children[5].title = '';
      this.items.value[1].children[5].type = '';

      if (data.data === null) {
        this.items.value.splice(0, 7);
      } else {
        for (let i = 0; i < data.data.partner_privilege_item.length; i++) {
          let status = 0;
          let name = '';
          status = data.data.partner_privilege_item[i].partner_privilege_item.status;
          name = data.data.partner_privilege_item[i].partner_privilege_item.description;
          if (status === 0) {
            if (name === 'product_list') {
              this.items.value[1].children[0].path = '';
              this.items.value[1].children[0].title = '';
              this.items.value[1].children[0].type = '';
            }
            if (name === 'order_list') {
              this.items.value[2].icon = '';
              this.items.value[2].title = '';
              this.items.value[2].type = '';
              this.items.value[2].active = true;
              this.items.value[2].children[0].path = '';
              this.items.value[2].children[0].title = '';
              this.items.value[2].children[0].type = '';
            }
            if (name === 'dashboard') {
            }
            if (name === 'product_add') {
              this.items.value[1].children[1].path = '';
              this.items.value[1].children[1].title = '';
              this.items.value[1].children[1].type = '';
            }
            if (name === 'payment_list') {
              this.items.value[3].icon = '';
              this.items.value[3].title = '';
              this.items.value[3].type = '';
              this.items.value[3].active = true;
              this.items.value[3].children[0].path = '';
              this.items.value[3].children[0].title = '';
              this.items.value[3].children[0].type = '';
            }
            if (name === 'shipment_add') {
              this.items.value[4].children[2].path = '';
              this.items.value[4].children[2].title = '';
              this.items.value[4].children[2].type = '';
            }
            if (name === 'shipment_list') {
              this.items.value[4].children[0].path = '';
              this.items.value[4].children[0].title = '';
              this.items.value[4].children[0].type = '';
              this.items.value[4].children[1].path = '';
              this.items.value[4].children[1].title = '';
              this.items.value[4].children[1].type = '';
            }
            if (name === 'upload_files') {
              this.items.value[5].icon = '';
              this.items.value[5].title = '';
              this.items.value[5].type = '';
              this.items.value[5].active = true;
            }
          }
        }

        if (this.items.value[4].children[0].path === '' && this.items.value[4].children[1].path === '' && this.items.value[4].children[2].path === '') {
          this.items.value[4].icon = '';
          this.items.value[4].title = '';
          this.items.value[4].type = '';
          this.items.value[4].active = true;
        }

        if (this.items.value[1].children[0].path === '' && this.items.value[1].children[1].path === '') {
          this.items.value[1].icon = '';
          this.items.value[1].title = '';
          this.items.value[1].type = '';
          this.items.value[1].active = true;
        }
      }
    }
    this.items.value[5].icon = '';
    this.items.value[5].title = '';
    this.items.value[5].type = '';

    // this.items.value[9].icon = '';
    // this.items.value[9].title = '';
    // this.items.value[9].type = '';

    this.items.value[9].children[0].path = '';
    this.items.value[9].children[0].title = '';
    this.items.value[9].children[0].type = '';

    this.items.value[9].children[1].path = '';
    this.items.value[9].children[1].title = '';
    this.items.value[9].children[1].type = '';

    this.items.value[9].children[2].path = '';
    this.items.value[9].children[2].title = '';
    this.items.value[9].children[2].type = '';

    this.items.value[11].icon = '';
    this.items.value[11].title = '';
    this.items.value[11].type = '';
  }

  getDetails(payloard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'privilege/viewAllPrivilegesByPartner', payloard, {headers});
  }

  qaPrivileges() {
    let payloard = {
      user_u_id: sessionStorage.getItem('userId')
    };
    this.getQaPrivileges(payloard).subscribe(
      data => this.managePrivileges(data)
    );
  }

  managePrivileges(data) {
    if (data.data != null) {
      for (let i = 0; i < data.data.user_privilege_item.length; i++) {
        let description = data.data.user_privilege_item[i].user_privilege_item.description;
        let status = data.data.user_privilege_item[i].user_privilege_item.status;
        let value = data.data.user_privilege_item[i].user_privilege_item.value;
        if (status == 0) {
          if (description === 'category') {
            this.items.value[1].icon = '';
            this.items.value[1].title = '';
            this.items.value[1].type = '';
            this.items.value[1].icon = '';
            this.items.value[1].title = '';
            this.items.value[1].type = '';
            this.items.value[1].active = true;
          }

          if (description === 'product_list') {

            this.items.value[2].children[0].path = '';
            this.items.value[2].children[0].title = '';
            this.items.value[2].children[0].type = '';
            this.items.value[2].icon = '';
            this.items.value[2].title = '';
            this.items.value[2].type = '';
          }

          if (description === 'order_list') {

            this.items.value[3].icon = '';
            this.items.value[3].title = '';
            this.items.value[3].type = '';
            this.items.value[3].active = true;
            this.items.value[3].children[0].path = '';
            this.items.value[3].children[0].title = '';
            this.items.value[3].children[0].type = '';

          }

          if (description === 'payment_list') {
            this.items.value[4].icon = '';
            this.items.value[4].title = '';
            this.items.value[4].type = '';
            this.items.value[4].active = true;
            this.items.value[4].children[0].path = '';
            this.items.value[4].children[0].title = '';
            this.items.value[4].children[0].type = '';

          }

          if (description === 'shipment_recevie_list') {
            this.items.value[5].icon = '';
            this.items.value[5].title = '';
            this.items.value[5].type = '';
            this.items.value[5].active = true;
            this.items.value[5].children[3].path = '';
            this.items.value[5].children[3].title = '';
            this.items.value[5].children[3].type = '';
          }


          if (description === 'create_user') {
            if (data.data.user_privilege_item[6].user_privilege_item.status == 1 && data.data.user_privilege_item[7].user_privilege_item.status || data.data.user_privilege_item[8].user_privilege_item.status) {
              this.items.value[6].children[0].path = '';
              this.items.value[6].children[0].title = '';
              this.items.value[6].children[0].type = '';
            } else {
              this.items.value[6].icon = '';
              this.items.value[6].title = '';
              this.items.value[6].type = '';
              this.items.value[6].active = true;
              this.items.value[6].children[0].path = '';
              this.items.value[6].children[0].title = '';
              this.items.value[6].children[0].type = '';
            }
          }

          if (description === 'user_list') {

            if (data.data.user_privilege_item[6].user_privilege_item.status == 1 || data.data.user_privilege_item[7].user_privilege_item.status || data.data.user_privilege_item[8].user_privilege_item.status) {
              this.items.value[6].children[1].path = '';
              this.items.value[6].children[1].title = '';
              this.items.value[6].children[1].type = '';
            } else {
              this.items.value[6].icon = '';
              this.items.value[6].title = '';
              this.items.value[6].type = '';
              this.items.value[6].active = true;
              this.items.value[6].children[1].path = '';
              this.items.value[6].children[1].title = '';
              this.items.value[6].children[1].type = '';
            }
          }

          if (description === 'user_privileges') {
            if (data.data.user_privilege_item[6].user_privilege_item.status == 1 || data.data.user_privilege_item[7].user_privilege_item.status || data.data.user_privilege_item[8].user_privilege_item.status) {
              this.items.value[6].children[2].path = '';
              this.items.value[6].children[2].title = '';
              this.items.value[6].children[2].type = '';
            } else {
              this.items.value[6].icon = '';
              this.items.value[6].title = '';
              this.items.value[6].type = '';
              this.items.value[6].active = true;
              this.items.value[6].children[2].path = '';
              this.items.value[6].children[2].title = '';
              this.items.value[6].children[2].type = '';
            }
          }
        } else {
        }
      }
    } else {

      this.items.value[1].icon = '';
      this.items.value[1].title = '';
      this.items.value[1].type = '';
      this.items.value[1].icon = '';
      this.items.value[1].title = '';
      this.items.value[1].type = '';
      this.items.value[1].active = true;


      this.items.value[2].children[0].path = '';
      this.items.value[2].children[0].title = '';
      this.items.value[2].children[0].type = '';
      this.items.value[2].icon = '';
      this.items.value[2].title = '';
      this.items.value[2].type = '';


      this.items.value[3].icon = '';
      this.items.value[3].title = '';
      this.items.value[3].type = '';
      this.items.value[3].active = true;
      this.items.value[3].children[0].path = '';
      this.items.value[3].children[0].title = '';
      this.items.value[3].children[0].type = '';


      this.items.value[4].icon = '';
      this.items.value[4].title = '';
      this.items.value[4].type = '';
      this.items.value[4].active = true;
      this.items.value[4].children[0].path = '';
      this.items.value[4].children[0].title = '';
      this.items.value[4].children[0].type = '';


      this.items.value[5].icon = '';
      this.items.value[5].title = '';
      this.items.value[5].type = '';
      this.items.value[5].active = true;
      this.items.value[5].children[3].path = '';
      this.items.value[5].children[3].title = '';
      this.items.value[5].children[3].type = '';


      this.items.value[6].icon = '';
      this.items.value[6].title = '';
      this.items.value[6].type = '';
      this.items.value[6].active = true;
      this.items.value[6].children[0].path = '';
      this.items.value[6].children[0].title = '';
      this.items.value[6].children[0].type = '';


      this.items.value[6].children[1].path = '';
      this.items.value[6].children[1].title = '';
      this.items.value[6].children[1].type = '';


      this.items.value[6].children[2].path = '';
      this.items.value[6].children[2].title = '';
      this.items.value[6].children[2].type = '';


    }

  }

  getQaPrivileges(payloard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'users/getAllPrivilegeByUser', payloard, {headers});
  }

  manageGuest() {
    this.items.value[1].icon = '';
    this.items.value[1].title = '';
    this.items.value[1].type = '';
    this.items.value[1].icon = '';
    this.items.value[1].title = '';
    this.items.value[1].type = '';
    this.items.value[1].active = true;

    this.items.value[2].children[0].path = '';
    this.items.value[2].children[0].title = '';
    this.items.value[2].children[0].type = '';
    this.items.value[2].icon = '';
    this.items.value[2].title = '';
    this.items.value[2].type = '';

    this.items.value[3].icon = '';
    this.items.value[3].title = '';
    this.items.value[3].type = '';
    this.items.value[3].active = true;
    this.items.value[3].children[0].path = '';
    this.items.value[3].children[0].title = '';
    this.items.value[3].children[0].type = '';

    this.items.value[4].icon = '';
    this.items.value[4].title = '';
    this.items.value[4].type = '';
    this.items.value[4].active = true;
    this.items.value[4].children[0].path = '';
    this.items.value[4].children[0].title = '';
    this.items.value[4].children[0].type = '';

    this.items.value[5].icon = '';
    this.items.value[5].title = '';
    this.items.value[5].type = '';
    this.items.value[5].active = true;
    this.items.value[5].children[3].path = '';
    this.items.value[5].children[3].title = '';
    this.items.value[5].children[3].type = '';

    this.items.value[6].icon = '';
    this.items.value[6].title = '';
    this.items.value[6].type = '';
    this.items.value[6].active = true;
    this.items.value[6].children[0].path = '';
    this.items.value[6].children[0].title = '';
    this.items.value[6].children[0].type = '';

    this.items.value[8].icon = '';
    this.items.value[8].title = '';
    this.items.value[8].type = '';
    this.items.value[8].active = true;

    this.items.value[9].icon = '';
    this.items.value[9].title = '';
    this.items.value[9].type = '';
    this.items.value[9].active = true;

    this.items.value[10].icon = '';
    this.items.value[10].title = '';
    this.items.value[10].type = '';
    this.items.value[10].active = true;
    this.items.value[10].children[0].path = '';
    this.items.value[10].children[0].title = '';
    this.items.value[10].children[0].type = '';

    this.items.value[11].icon = '';
    this.items.value[11].title = '';
    this.items.value[11].type = '';
    this.items.value[11].active = true;
    this.items.value[11].children[0].path = '';
    this.items.value[11].children[0].title = '';
    this.items.value[11].children[0].type = '';
  }

  manageCategoryManager() {
    this.items.value[1].icon = '';
    this.items.value[1].title = '';
    this.items.value[1].type = '';

    this.items.value[2].children[1].path = '';
    this.items.value[2].children[1].title = '';
    this.items.value[2].children[1].type = '';

    this.items.value[2].children[2].path = '';
    this.items.value[2].children[2].title = '';
    this.items.value[2].children[2].type = '';

    this.items.value[2].children[3].path = '';
    this.items.value[2].children[3].title = '';
    this.items.value[2].children[3].type = '';

    this.items.value[6].children[0].path = '';
    this.items.value[6].children[0].title = '';
    this.items.value[6].children[0].type = '';
    this.items.value[6].children[2].path = '';
    this.items.value[6].children[2].title = '';
    this.items.value[6].children[2].type = '';

    this.items.value[3].icon = '';
    this.items.value[3].title = '';
    this.items.value[3].type = '';
    this.items.value[3].active = true;
    this.items.value[3].children[0].path = '';
    this.items.value[3].children[0].title = '';
    this.items.value[3].children[0].type = '';

    this.items.value[5].icon = '';
    this.items.value[5].title = '';
    this.items.value[5].type = '';
    this.items.value[5].active = true;
    this.items.value[5].children[0].path = '';
    this.items.value[5].children[0].title = '';
    this.items.value[5].children[0].type = '';
    this.items.value[5].children[1].path = '';
    this.items.value[5].children[1].title = '';
    this.items.value[5].children[1].type = '';
    this.items.value[5].children[2].path = '';
    this.items.value[5].children[2].title = '';
    this.items.value[5].children[2].type = '';
    this.items.value[5].children[3].path = '';
    this.items.value[5].children[3].title = '';
    this.items.value[5].children[3].type = '';

    this.items.value[7].icon = '';
    this.items.value[7].title = '';
    this.items.value[7].type = '';


    this.items.value[9].icon = '';
    this.items.value[9].title = '';
    this.items.value[9].type = '';

    this.items.value[10].icon = '';
    this.items.value[10].title = '';
    this.items.value[10].type = '';
    this.items.value[10].children[0].path = '';
    this.items.value[10].children[0].title = '';
    this.items.value[10].children[0].type = '';

  }

  manageStoresManager() {
    this.items.value[1].icon = '';
    this.items.value[1].title = '';
    this.items.value[1].type = '';


    this.items.value[2].icon = '';
    this.items.value[2].title = '';
    this.items.value[2].type = '';

    this.items.value[2].children[1].path = '';
    this.items.value[2].children[1].title = '';
    this.items.value[2].children[1].type = '';

    this.items.value[2].children[2].path = '';
    this.items.value[2].children[2].title = '';
    this.items.value[2].children[2].type = '';

    this.items.value[5].children[2].path = '';
    this.items.value[5].children[2].title = '';
    this.items.value[5].children[2].type = '';

    this.items.value[5].children[3].path = '';
    this.items.value[5].children[3].title = '';
    this.items.value[5].children[3].type = '';

    this.items.value[6].icon = '';
    this.items.value[6].title = '';
    this.items.value[6].type = '';
    this.items.value[6].active = true;
    this.items.value[6].children[0].path = '';
    this.items.value[6].children[0].title = '';
    this.items.value[6].children[0].type = '';
    this.items.value[6].icon = '';
    this.items.value[6].title = '';
    this.items.value[6].type = '';
    this.items.value[6].active = true;
    this.items.value[6].children[1].path = '';
    this.items.value[6].children[1].title = '';
    this.items.value[6].children[1].type = '';
    this.items.value[6].icon = '';
    this.items.value[6].title = '';
    this.items.value[6].type = '';
    this.items.value[6].active = true;
    this.items.value[6].children[2].path = '';
    this.items.value[6].children[2].title = '';
    this.items.value[6].children[2].type = '';

    this.items.value[3].icon = '';
    this.items.value[3].title = '';
    this.items.value[3].type = '';
    this.items.value[3].active = true;
    this.items.value[3].children[0].path = '';
    this.items.value[3].children[0].title = '';
    this.items.value[3].children[0].type = '';

    this.items.value[7].icon = '';
    this.items.value[7].title = '';
    this.items.value[7].type = '';

    this.items.value[8].icon = '';
    this.items.value[8].title = '';
    this.items.value[8].type = '';

    this.items.value[9].icon = '';
    this.items.value[9].title = '';
    this.items.value[9].type = '';

    this.items.value[10].icon = '';
    this.items.value[10].title = '';
    this.items.value[10].type = '';
    this.items.value[10].active = true;
    this.items.value[10].children[0].path = '';
  }

  // manageFinanceUser() {
  //   this.items.value[1].icon = '';
  //   this.items.value[1].title = '';
  //   this.items.value[1].type = '';
  //
  //
  //   this.items.value[2].icon = '';
  //   this.items.value[2].title = '';
  //   this.items.value[2].type = '';
  //
  //   this.items.value[2].children[1].path = '';
  //   this.items.value[2].children[1].title = '';
  //   this.items.value[2].children[1].type = '';
  //
  //   this.items.value[2].children[2].path = '';
  //   this.items.value[2].children[2].title = '';
  //   this.items.value[2].children[2].type = '';
  //
  //   this.items.value[5].children[1].path = '';
  //   this.items.value[5].children[1].title = '';
  //   this.items.value[5].children[1].type = '';
  //
  //   this.items.value[5].children[2].path = '';
  //   this.items.value[5].children[2].title = '';
  //   this.items.value[5].children[2].type = '';
  //
  //   this.items.value[6].icon = '';
  //   this.items.value[6].title = '';
  //   this.items.value[6].type = '';
  //   this.items.value[6].active = true;
  //   this.items.value[6].children[0].path = '';
  //   this.items.value[6].children[0].title = '';
  //   this.items.value[6].children[0].type = '';
  //   this.items.value[6].icon = '';
  //   this.items.value[6].title = '';
  //   this.items.value[6].type = '';
  //   this.items.value[6].active = true;
  //   this.items.value[6].children[1].path = '';
  //   this.items.value[6].children[1].title = '';
  //   this.items.value[6].children[1].type = '';
  //   this.items.value[6].icon = '';
  //   this.items.value[6].title = '';
  //   this.items.value[6].type = '';
  //   this.items.value[6].active = true;
  //   this.items.value[6].children[2].path = '';
  //   this.items.value[6].children[2].title = '';
  //   this.items.value[6].children[2].type = '';
  //
  //   this.items.value[3].icon = '';
  //   this.items.value[3].title = '';
  //   this.items.value[3].type = '';
  //   this.items.value[3].active = true;
  //   this.items.value[3].children[0].path = '';
  //   this.items.value[3].children[0].title = '';
  //   this.items.value[3].children[0].type = '';
  //
  //   this.items.value[7].icon = '';
  //   this.items.value[7].title = '';
  //   this.items.value[7].type = '';
  //
  //   this.items.value[8].icon = '';
  //   this.items.value[8].title = '';
  //   this.items.value[8].type = '';
  //
  //   this.items.value[9].icon = '';
  //   this.items.value[9].title = '';
  //   this.items.value[9].type = '';
  //
  //   this.items.value[10].icon = '';
  //   this.items.value[10].title = '';
  //   this.items.value[10].type = '';
  //   this.items.value[10].active = true;
  //   this.items.value[10].children[0].path = '';
  //
  //   console.log(this.items);
  // }
  manageFinanceUser() {
    this.items.value[1].icon = '';
    this.items.value[1].title = '';
    this.items.value[1].type = '';

    this.items.value[2].children[1].path = '';
    this.items.value[2].children[1].title = '';
    this.items.value[2].children[1].type = '';

    this.items.value[2].children[2].path = '';
    this.items.value[2].children[2].title = '';
    this.items.value[2].children[2].type = '';

    this.items.value[6].children[0].path = '';
    this.items.value[6].children[0].title = '';
    this.items.value[6].children[0].type = '';
    this.items.value[6].children[2].path = '';
    this.items.value[6].children[2].title = '';
    this.items.value[6].children[2].type = '';

    this.items.value[3].icon = '';
    this.items.value[3].title = '';
    this.items.value[3].type = '';
    this.items.value[3].active = true;
    this.items.value[3].children[0].path = '';
    this.items.value[3].children[0].title = '';
    this.items.value[3].children[0].type = '';

    this.items.value[5].icon = '';
    this.items.value[5].title = '';
    this.items.value[5].type = '';
    this.items.value[5].active = true;
    this.items.value[5].children[0].path = '';
    this.items.value[5].children[0].title = '';
    this.items.value[5].children[0].type = '';
    this.items.value[5].children[1].path = '';
    this.items.value[5].children[1].title = '';
    this.items.value[5].children[1].type = '';
    this.items.value[5].children[2].path = '';
    this.items.value[5].children[2].title = '';
    this.items.value[5].children[2].type = '';
    this.items.value[5].children[3].path = '';
    this.items.value[5].children[3].title = '';
    this.items.value[5].children[3].type = '';

    this.items.value[7].icon = '';
    this.items.value[7].title = '';
    this.items.value[7].type = '';


    this.items.value[9].icon = '';
    this.items.value[9].title = '';
    this.items.value[9].type = '';

    this.items.value[10].icon = '';
    this.items.value[10].title = '';
    this.items.value[10].type = '';
    this.items.value[10].children[0].path = '';
    this.items.value[10].children[0].title = '';
    this.items.value[10].children[0].type = '';

  }
}
