import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CategoryReportComponent} from './category-report/category-report.component';
import {ProductReportComponent} from './product-report/product-report.component';
import {VendorReportComponent} from './vendor-report/vendor-report.component';
import {ItemwiseShipmentReportComponent} from './itemwise-shipment-report/itemwise-shipment-report.component';
import {ItemwiseSalesReportComponent} from "./itemwise-sales-report/itemwise-sales-report.component";
import {OrderReportComponent} from "./order-report/order-report.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'category-report',
        component: CategoryReportComponent,
        data: {
          title: 'Category Report',
          breadcrumb: 'Category Report'
        }
      },
      {
        path: 'product-report',
        component: ProductReportComponent,
        data: {
          title: 'Product Report',
          breadcrumb: 'Product Report'
        }
      },
      {
        path: 'supplier-report',
        component: VendorReportComponent,
        data: {
          title: 'Supplier Report',
          breadcrumb: 'Supplier Report'
        }
      },
      {
        path: 'itemwise-shipment-report',
        component: ItemwiseShipmentReportComponent,
        data: {
          title: 'Item Wise Shipment',
          breadcrumb: 'Item Wise Shipment'
        }
      },
      {
        path: 'itemwise-sales-report',
        component: ItemwiseSalesReportComponent,
        data: {
          title: 'Item Wise Sales',
          breadcrumb: 'Item Wise Sales'
        }
      },
      {
        path: 'order-report',
        component: OrderReportComponent,
        data: {
          title: 'Order Report',
          breadcrumb: 'Order Report'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}
