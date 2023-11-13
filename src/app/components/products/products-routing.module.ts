import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DigitalListComponent} from './list-product/digital-list.component';
import {DigitalAddComponent} from './add-product/digital-add.component';
import {EditProductsComponent} from "./edit-products/edit-products.component";
import {ViewProductComponent} from "./view-product/view-product.component";
import {ApproveProductComponent} from "./approve-product/approve-product.component";
import {QaApprovalViewComponent} from './qa-approval-view/qa-approval-view.component';
import {QaNormalViewComponent} from './qa-normal-view/qa-normal-view.component';
import {ProductViewComponent} from "./product-view/product-view.component";
import {ApproveEditProductComponent} from "./approve-edit-product/approve-edit-product.component";
import {
  ApproveEditImageComponentComponent
} from "./approve-edit-image-component/approve-edit-image-component.component";
import {AnalyticsProductService} from "../../shared/service/analytics-product.service";
import {AnalyticsProductViewComponent} from "./analytics-product-view/analytics-product-view.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'digital/digital-product-list',
        component: DigitalListComponent,
        data: {
          title: 'Product List',
          breadcrumb: 'Product List'
        }
      },
      {
        path: 'digital/digital-add-product',
        component: DigitalAddComponent,
        data: {
          title: 'Add Products',
          breadcrumb: 'Add Product'
        }
      },
      {
        path: 'digital/digital-edit-product/:id',
        component: EditProductsComponent,
        data: {
          // title: 'Edit Products',
          // breadcrumb: 'Edit Product'
        }
      },
      {
        path: 'digital/view-product/:id',
        component: ProductViewComponent,
        data: {
           title: 'View Products',
           breadcrumb: 'View Product'
        }
      },
      {
        path: 'digital/digital-view-product/:id/:name',
        component: ViewProductComponent,
        data: {
          title: 'View Products',
          breadcrumb: 'View Product'
        }
      },
      {
        path: 'digital/digital-approve-product/:id',
        component: ApproveProductComponent,
        data: {
          title: 'Approve Products',
          breadcrumb: 'Approve Product'
        }
      },
      {
        path: 'digital/qa-approve-product/:id',
        component: QaApprovalViewComponent,
        data: {
          title: 'Qa Approve',
          breadcrumb: 'QA Approve Product'
        }
      },
      {
        path: 'digital/qa-approve-view-product/:id',
        component: QaNormalViewComponent,
        data: {
          title: 'Qa Approve View',
          breadcrumb: 'QA Approve View Product'
        }
      },
      {
        path: 'digital/edited-approve-product/:id',
        component: ApproveEditProductComponent,
        data: {
          title: 'Approve-Edit-Product',
          breadcrumb: 'Approve Edit Product'
        }
      },
      {
        path: 'digital/edited-image-approve-product/:id',
        component: ApproveEditImageComponentComponent,
        data: {
          title: 'Approve-Image-Edit-Product',
          breadcrumb: 'Approve image Edited Product'
        }
      },
      {
        path: 'digital/analytics-product-view',
        component: AnalyticsProductViewComponent,
        data: {
          title: 'Analytics Product View List',
          breadcrumb: 'Analytics Product View List'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {
}
