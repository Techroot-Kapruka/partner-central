import {RouterModule, Routes} from '@angular/router';
import {ListOrdersComponent} from './list-orders/list-orders.component';
import {NgModule} from '@angular/core';
import {ViewOrdersComponent} from "./view-orders/view-orders.component";
import {PoListComponent} from "./po-list/po-list.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-orders',
        component: ListOrdersComponent,
        data: {
          title: 'Order List',
          breadcrumb: 'Order List'
        }
      },
      {
        path: 'view-order/:id/:part',
        component: ViewOrdersComponent,
        data: {
          title: 'View Order',
          breadcrumb: 'View Order'
        }
      },
      {
        path: 'po-list',
        component: PoListComponent,
        data: {
          title: 'View PO Order',
          breadcrumb: 'View PO Order'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrdersRoutingModule {
}
