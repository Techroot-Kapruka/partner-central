import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CategoryReportComponent} from './category-report/category-report.component';
import {ProductReportComponent} from './product-report/product-report.component';
import {VendorReportComponent} from "./vendor-report/vendor-report.component";

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {
}
