import {Component, Input, OnInit} from '@angular/core';
import {DashboardService} from '../../shared/service/dashboard.service';
import {ActivatedRoute, Router} from '@angular/router';
import {zip} from 'rxjs';
import {colorSets} from '@swimlane/ngx-charts';
import {ChartOptions} from 'chart.js';
import Swal from 'sweetalert2';
import {AnalyticsProductService} from "../../shared/service/analytics-product.service";
import {ProductService} from "../../shared/service/product.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public prfUserName = 'Ishan';
  public mathsCount = 0;
  public specialGift = 0;
  public partnerOrders = 0;
  public receivedShipment = 0;
  public pendingShipmentCount = 0;
  public approvalUserCount = 0;
  public isAdmin = false;
  public busName = sessionStorage.getItem('businessName');
  public names = '';
  public postingDate = '';
  public total = '';
  public statuss = '';
  public supplier = '';
  public supplierName = '';
  public shopUrl = 'https://www.kapruka.com/partner/';

  @Input()
  public latest = [];
  public latestOrderUpdate = '';
  public latestSync = '';
  public latestProduct = [];
  public invoiceArry = [];
  public invoiceTitleArry = [];
  public partnerId = '';
  public boolLog = '';
  public isLoginUser = false;
  public isLoginPartner = false;
  public isOrderShow = false;
  public qaTables = false;
  public isPendingShipmentShow = false;
  public qaApprovalProductTable = false;
  public qaApprovalCount = 0;
  public activeCount = 0;
  public pendingCount = 0;
  public analyticsProductViewTotal = 0;
  public analyticsProductCartTotal = 0;
  public analyticsProductOrderTotal = 0;
  public qaApprovedLatestProducts = [];
  public mathCountForApprovalPendingProduct = 0;
  public isApprovalPendingShow = false;
  public isGuest = false;
  public productStatus = '';
  public isDuoghnutChart = false;
  public isPieChart = false;
  public isColumnChart = false;
  showViewShopButton = false;

  constructor(private productService: ProductService ,private dashboardService: DashboardService, private router: Router, private _Activatedroute: ActivatedRoute,
              private analyticsService: AnalyticsProductService) {
    this._Activatedroute.paramMap.subscribe(params => {
      this.partnerId = params.get('partnerId');
      this.boolLog = params.get('bool');
      this.manageAsLoginPartner(this.boolLog, this.partnerId);
      this.showElerments();
    });

    const roleLog = sessionStorage.getItem('userRole');
    if (roleLog === 'ROLE_ADMIN' || roleLog === 'ROLE_CATEGORY_MANAGER'|| roleLog === 'ROLE_SUPER_ADMIN') {
      this.isAdmin = true;
    } else if (roleLog === 'ROLE_GUEST') {
      this.isGuest = true;
    }

    if (sessionStorage.getItem('userRole') === 'ROLE_GUEST') {

    } else {
      this.getCount();
      this.setPendingShipmentCount();
      this.approvalPendingUserCount();
      this.setReceivedShipmentCount();
      this.orderCountByBusinessName();
      this.approvelPendingProduct();
      this.partnerCount();
      // this.specialGiftCount();
      this.getLatestOrder();
      this.latestProducts();
      // this.getLatestInvoice();
      this.getQaNotApprovedProductsCount();
      this.getQaApprovedLatestProducts();
      this.getSumProductViewTotal();
      this.getSumProductAddToCart();
      this.getSumProductOrderTotal();
    }
  }

  /* Start Column Chart */
  view: [number, number] = [730, 530];

  chartData: any[] = [
    {
      name: 'Series 1',
      value: 100,
    },
    {
      name: 'Series 2',
      value: 200,
    },
    {
      name: 'Series 3',
      value: 300,
    },
    {
      name: 'Series 4',
      value: 400,
    },
    {
      name: 'Series 5',
      value: 150,
    },
    {
      name: 'Series 6',
      value: 500,
    },
  ];

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#5AA454', '#E44D25', '#CFC0BB'],
  };

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  xAxisLabel = 'X-Axis Label';
  showYAxisLabel = true;
  yAxisLabel = 'Y-Axis Label';
  /* End Column Chart */

  /* Start Pie Chart */
  single: any[] = [
    {
      name: 'Category 1',
      value: 200,
    },
    {
      name: 'Category 2',
      value: 300,
    },
    {
      name: 'Category 3',
      value: 400,
    },
  ];

  // Customize colors
  colorScheme1 = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB'],
  };
  /* End Pie Chart */

  /* Start Doughnut Chart */
  public doughnutChartLabels = ['Label 1', 'Label 2', 'Label 3'];
  public doughnutChartData = [300, 450, 100];
  public doughnutChartType = 'doughnut';
  public doughnutChartColors: any[] = [
    {
      backgroundColor: ['#5AA454', '#E44D25', '#CFC0BB'],
    },
  ];

  /* End Doughnut Chart */
  getCount(){
    const busName = sessionStorage.getItem('businessName');
    const userRole = sessionStorage.getItem('userRole');
    const categoryID = sessionStorage.getItem('userId');

    this.productService.getAllActiveProductList(busName, categoryID).subscribe(
      data => this.activeProductCount(data),
    );

    this.productService.getnonActiveProduct(busName, categoryID).subscribe(
      data => this.pendingProductCount(data),
    );
  }

  pendingProductCount(data){
    console.log(sessionStorage.getItem('userRole'))
    console.log(this.pendingCount=data.data.length)
    this.pendingCount=data.data.length
  }

  activeProductCount(data){
    this.activeCount=data.data.length
  }
  showElerments() {

    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      this.isLoginUser = true;
      this.showLoginButton();
      this.isLoginPartner = false;
      this.isOrderShow = true;
      this.qaTables = true;
      this.qaApprovalProductTable = false;
    } else if (sessionStorage.getItem('userRole') === 'ROLE_QA') {
      this.isLoginUser = true;
      this.isLoginPartner = false;
      this.isOrderShow = false;
      this.qaTables = false;
      this.qaApprovalProductTable = true;
    } else if (sessionStorage.getItem('userRole') === 'ROLE_ADMIN' || sessionStorage.getItem('userRole') === 'ROLE_SUPER_ADMIN') {
      this.isLoginUser = false;
      this.isLoginPartner = true;
      this.isOrderShow = true;
      this.isApprovalPendingShow = true;
      this.qaTables = true;
      this.isPendingShipmentShow = true;
      this.qaApprovalProductTable = false;

      /* Charts */
      this.isDuoghnutChart = true;
      this.isColumnChart = true;
      /* Charts */

    } else if (sessionStorage.getItem('userRole') === 'ROLE_USER') {
      this.isLoginUser = false;
      this.isLoginPartner = true;
      this.isOrderShow = true;
      this.qaTables = true;
      this.qaApprovalProductTable = false;
    } else if (sessionStorage.getItem('userRole') === 'ROLE_GUEST') {
      this.isLoginUser = false;
      this.isLoginPartner = true;
      this.isOrderShow = true;
      this.qaTables = true;
      this.qaApprovalProductTable = false;
    } else if (sessionStorage.getItem('userRole') === 'ROLE_STORES_MANAGER') {
      this.isPendingShipmentShow = true;
      this.isApprovalPendingShow = false;
      this.isLoginUser = false;
      this.isLoginPartner = false;
      this.isOrderShow = false;
      this.qaTables = false;
    } else if (sessionStorage.getItem('userRole') === 'ROLE_CATEGORY_MANAGER') {
      this.isApprovalPendingShow = true;
      this.isOrderShow = true;
      this.isPendingShipmentShow = true;
    }
  }

  ngOnInit() {
    this.getShopUrl();
  }

  showLoginButton() {
    setTimeout(() => {
      this.showViewShopButton = true;
    }, 2200);
  }

  redirectToShop() {
    const newWindow = window.open(this.shopUrl, '_blank');
    if (newWindow) {
      newWindow.focus();
    } else {
      Swal.fire(
        'error',
        'The new window/tab was blocked by the pop-up blocker',
        'error'
      );
    }
  }

  getShopUrl() {
    const payload = {
      partner_u_id: sessionStorage.getItem('partnerId')
    };
    this.dashboardService.getShopName(payload).subscribe(
      data => this.manageShopUrl(data)
    );
  }

  manageShopUrl(data) {
    if (data.data != null) {
      this.shopUrl = 'https://www.kapruka.com/partner/' + data.data;
    }
  }

  approvalPendingUserCount() {
    const roleLog = sessionStorage.getItem('userRole');
    if (roleLog === 'ROLE_ADMIN') {
      this.dashboardService.getApprovalPendingPartnerCount(roleLog).subscribe(
        data => this.manageApprovalPendingUserCount(data)
      );
    }
  }

  orderCountByBusinessName() {
    const roleLog = sessionStorage.getItem('userRole');
    if (roleLog === 'ROLE_ADMIN') {
      this.dashboardService.getOrderCountByAdmin().subscribe(
        data => this.manageOrderCountByBusinessName(data)
      );
    } else {
      const payLoad = {
        partner_u_id: sessionStorage.getItem('partnerId')
      };
      this.dashboardService.getOrderCountByBusinessName(payLoad).subscribe(
        data => this.manageOrderCountByBusinessName(data)
      );
    }
  }

  specialGiftCount() {
    const roleLog = sessionStorage.getItem('userRole');
    if (roleLog === 'ROLE_ADMIN') {
      this.dashboardService.getSpecialGiftCount().subscribe(
        data => this.managespecialGiftCount(data)
      );

    } else if (roleLog === 'ROLE_CATEGORY_MANAGER') {
      const payLoad = {
        user_u_id: sessionStorage.getItem('userId')
      };
      this.dashboardService.getSpecialGiftCountByCatManager(payLoad).subscribe(
        data => this.managespecialGiftCount(data)
      );
    } else {
      const payLoad = {
        partner_u_id: sessionStorage.getItem('partnerId')
      };
      this.dashboardService.getSpecialGiftCountByPartner(payLoad).subscribe(
        data => this.managespecialGiftCount(data)
      );
    }
  }

  approvelPendingProduct() {
    const role = sessionStorage.getItem('userRole');
    if (role === 'ROLE_CATEGORY_MANAGER') {
      const payLoard = {
        user_u_id: sessionStorage.getItem('userId')
      };
      this.dashboardService.getApprovelPendingProductCountCategoryWise(payLoard).subscribe(
        data => this.manageApprovalPendingProduct(data)
      );
    } else {
      this.dashboardService.getApprovelPendingProductCount().subscribe(
        data => this.manageApprovalPendingProduct(data)
      );
    }
  }

  partnerCount() {
    const roleLog = sessionStorage.getItem('userRole');
    if (roleLog === 'ROLE_ADMIN') {
      const payLoad = {
        businessName: sessionStorage.getItem('businessName')
      };
      this.dashboardService.getPartnerCount(payLoad).subscribe(
        data => this.managePartner(data)
      );
    } else if (roleLog === 'ROLE_CATEGORY_MANAGER') {
      const payLoard = {
        user_u_id: sessionStorage.getItem('userId')
      };
      this.dashboardService.getPartnerCountCatWise(payLoard).subscribe(
        data => this.managePartner(data)
      );
    }
  }

  getSumProductViewTotal() {
    const object = {
      vendor_code: sessionStorage.getItem('partnerId')
    };
    this.analyticsService.getSumProductViewTotal(object).subscribe(
      data => this.manageGetSumProductViewTotal(data)
    );
  }

  getSumProductAddToCart() {
    const object = {
      vendor_code: sessionStorage.getItem('partnerId')
    };
    this.analyticsService.getSumProductAddToCart(object).subscribe(
      data => this.manageGetSumProductAddToCart(data)
    );
  }

  getSumProductOrderTotal() {
    const object = {
      vendor_code: sessionStorage.getItem('partnerId')
    };
    this.analyticsService.getSumProductOrderTotal(object).subscribe(
      data => this.manageGetSumProductOrderTotal(data)
    );
  }

  managePartner(data) {
    if (data.data != null) {
      this.mathsCount = data.data.partner_count;
    }
  }

  managespecialGiftCount(data) {
    const roleLog = sessionStorage.getItem('userRole');
    if (roleLog === 'ROLE_ADMIN' || roleLog === 'ROLE_CATEGORY_MANAGER') {
      if (data.data != null) {
        this.specialGift = data.data;
      }
    } else {
      if (data.data != null) {
        this.specialGift = data.data.product_count;
      }
    }
  }

  manageOrderCountByBusinessName(data) {
    if (data.data == null) {
    } else {
      this.partnerOrders = data.data.order_count;
    }
  }

  getLatestOrder() {
    const userRole = sessionStorage.getItem('userRole');
    if (userRole === 'ROLE_ADMIN') {
      const payloard = {
        role: ['Admin', 'User']
      };

      this.dashboardService.getLatestFiveOrderAsAdmin(payloard).subscribe(
        data => this.manageFiveOrders(data),
        error => this.manageFiveOrdersError(error)
      );
    } else {
      const partnerId = sessionStorage.getItem('partnerId');
      const payloard = {
        partnerUser: {
          partner_u_id: partnerId
        },
        role: ['Partner']
      };

      this.dashboardService.getLatestFiveOrder(payloard).subscribe(
        data => this.manageFiveOrders(data),
        error => this.manageFiveOrdersError(error)
      );
    }
  }

  manageFiveOrders(data) {
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        const arr = {
          orderId: data.data[i].id,
          orderDate: data.data[i].order_date,
          email: data.data[i].cartsnapshot[0].name,
          deliveryDate: data.data[i].delivery_date,
          pnref: data.data[i].pnref,
          country: data.data[i].country,
          status: data.data[i].status,
          lastUpdated: data.data[i].lastUpdated
        };
        this.latestOrderUpdate = arr.lastUpdated;
        this.latest.push(arr);
      }
    }
  }

  latestProducts() {
    const userRole = sessionStorage.getItem('userRole');
    if (userRole === 'ROLE_ADMIN') {
      this.dashboardService.latestProductsAdmin().subscribe(
        data => this.manageLatestProducts(data)
      );
    } else {
      const partnerId = sessionStorage.getItem('partnerId');
      const payloard = {
        partner_u_id: partnerId
      };

      this.dashboardService.latestProductsPartner(payloard).subscribe(
        data => this.manageLatestProducts(data)
      );
    }
  }

  manageLatestProducts(data) {
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        const arr = {
          productCode: data.data[i].product_code,
          category: data.data[i].category_code,
          title: data.data[i].title,
          brand: data.data[i].brand,
          createDate: data.data[i].create_date_time,
          vendor: data.data[i].vendor,
          item_group: data.data[i].item_group,
          is_active: data.data[i].is_active,
          lastSync: data.data[i].lastSync
        };
        if (data.data[i].is_active == 1) {
          this.productStatus = 'Active'
        } else {
          this.productStatus = 'Pending'
        }
        this.latestSync = arr.lastSync;
        this.latestProduct.push(arr);
      }
    }
  }

  // getLatestInvoice() {
  //   if (sessionStorage.getItem('userRole') != 'ROLE_QA' && sessionStorage.getItem('userRole') != 'ROLE_USER' && sessionStorage.getItem('userRole') != 'ROLE_CATEGORY_MANAGER' && sessionStorage.getItem('userRole') != 'ROLE_STORES_MANAGER') {
  //     const payloard = {
  //       partner_u_id: sessionStorage.getItem('partnerId')
  //     };
  //
  //     this.dashboardService.getLatesInvoices(payloard).subscribe(
  //       data => this.manageLatesInvoices(data)
  //     );
  //   }
  // }

  manageLatesInvoices(data) {
    const keyArr = data.message.keys;
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

    if (data.message.values != null) {
      for (let i = 0; i < data.message.values.length; i++) {
        const arr = {
          invoiceNo: data.message.values[i][0],
          postingDate: data.message.values[i][1],
          totalAmount: data.message.values[i][2],
          currentStatus: data.message.values[i][3],
          supplierCode: data.message.values[i][4],
          supplierName: data.message.values[i][5]
        };
        this.invoiceArry.push(arr);
      }
    }
  }

  manageFiveOrdersError(error) {
    if (error.status === 401) {
      this.router.navigate(['/auth/login']);
    }
  }

  navigateOrders(index) {
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      const partId = sessionStorage.getItem('partnerId');
      const url = '/orders/view-order/' + index.orderId + '/' + partId;
      this.router.navigate([url]);
    } else {
      this.router.navigate(['/orders/list-orders']);
    }
  }

  navigateProduct() {
    this.router.navigate(['/products/digital/digital-product-list']);
  }

  navigateInvoice() {
    this.router.navigate(['/payment/list-payment']);
  }

  manageAsLoginPartner(boolString: string, partId: string) {
    if (boolString === 'true') {
      const payloard = {
        partner_u_id: partId
      };
      this.dashboardService.getApprovedPartnerAsLogin(payloard).subscribe(
        data => this.manageApprovedPartnerAsLogin(data)
      );
    }
  }

  manageApprovedPartnerAsLogin(data) {
    sessionStorage.setItem('userId', data.data.user_u_id);
    sessionStorage.setItem('userRole', 'ROLE_PARTNER');
    sessionStorage.setItem('businessName', data.data.partnerUser.businessName);
    sessionStorage.setItem('contactPersonName', data.data.contactPersonName);
    sessionStorage.setItem('temp_code', data.data.partnerUser.temp_code);
    sessionStorage.setItem('partnerId', data.data.partnerUser.partner_u_id);
    sessionStorage.setItem('productPrefix', '');
    sessionStorage.setItem('productPrefix', JSON.stringify(data.data.partnerUser.productPrefix));
    if (sessionStorage.getItem('sessionVal') === '0') {
      sessionStorage.setItem('sessionVal', '1');
      window.location.reload();
    }
  }

  getQaNotApprovedProductsCount() {
    const payLoard = {
      partner_u_id: sessionStorage.getItem('partnerId')
    };
    this.dashboardService.getApproveProductCountFormQa(payLoard).subscribe(
      data => this.manageGetApproveProductCountFormQa(data)
    );
  }

  manageGetApproveProductCountFormQa(data) {
    if (data.data != null) {
      this.qaApprovalCount = data.data;
    }
  }

  manageGetSumProductViewTotal(data) {
    if (data.data != null) {
      this.analyticsProductViewTotal = data.data.product_view_total;
    }
  }

  manageGetSumProductAddToCart(data) {
    if (data.data != null) {
      this.analyticsProductCartTotal = data.data.product_cart_total;
    }
  }

  manageGetSumProductOrderTotal(data) {
    if (data.data != null) {
      this.analyticsProductOrderTotal = data.data.product_order_total;
    }
  }

  getQaApprovedLatestProducts() {
    const payLoard = {
      qa_user_id: sessionStorage.getItem('userId')
    };
    this.dashboardService.getQaApprovedLatestProductsByQa(payLoard).subscribe(
      data => this.manageGetQaApprovedLatestProductsByQa(data)
    );
  }

  manageGetQaApprovedLatestProductsByQa(data) {
    this.qaApprovedLatestProducts = [];
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        const arr = {
          productCode: data.data[i].product_code,
          category: data.data[i].category_code,
          title: data.data[i].title,
          brand: data.data[i].brand,
          createDate: data.data[i].create_date
        };
        this.qaApprovedLatestProducts.push(arr);
      }
    }
  }

  private manageApprovalPendingProduct(data) {
    this.mathCountForApprovalPendingProduct = data.data;
  }

  private manageApprovalPendingUserCount(data: any) {
    if (data.data.partner_count != null) {
      this.approvalUserCount = data.data.partner_count;
    }
  }

  setReceivedShipmentCount() {
    this.dashboardService.getReceivedShipmentCount().subscribe(
      data => this.manageReceivedShipmentCount(data)
    );
  }

  private manageReceivedShipmentCount(data) {
    if (data.data != null) {
      this.receivedShipment = data.data.shipment_count;
    }
  }

  setPendingShipmentCount() {
    this.dashboardService.getPendingShipmentCount().subscribe(
      data => this.managePendingShipmentCount(data)
    );
  }

  private managePendingShipmentCount(data) {
    this.pendingShipmentCount = data.data.shipment_count;
  }
}
