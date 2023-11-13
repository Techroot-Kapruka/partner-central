import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ListShipmentComponent} from './list-shipment/list-shipment.component';
import {AddShipmentComponent} from './add-shipment/add-shipment.component';
import {EditShipmentComponent} from './edit-shipment/edit-shipment.component';
import {UnHoldShipmentComponent} from './un-hold-shipment/un-hold-shipment.component';
import {ListShipmentReservedComponent} from './list-shipment-reserved/list-shipment-reserved.component';
import {MakeReservedComponent} from './make-reserved/make-reserved.component';
import {RecievedShipmentComponent} from './recieved-shipment/recieved-shipment.component';
import {ListPendingShipmentComponent} from './list-pending-shipment/list-pending-shipment.component';
import {ListHoldShipmentComponent} from './list-hold-shipment/list-hold-shipment.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-shipment',
        component: ListShipmentComponent,
        data: {
          title: 'Shipment List',
          breadcrumb: 'Shipment List'
        }
      },
      {
        path: 'list-pending-shipment',
        component: ListPendingShipmentComponent,
        data: {
          title: 'Pending Shipment List',
          breadcrumb: 'Pending Shipments'
        }
      },
      {
        path: 'list-hold-shipment',
        component: ListHoldShipmentComponent,
        data: {
          title: 'Hold Shipment List',
          breadcrumb: 'Hold Shipments'
        }
      },
      {
        path: 'add-shipment',
        component: AddShipmentComponent,
        data: {
          title: 'Shipment Add',
          breadcrumb: 'Shipment Add'
        }
      },
      {
        path: 'view-shipment/:id',
        component: EditShipmentComponent,
        data: {
          title: 'Shipment Details View',
          breadcrumb: 'Shipment Details View'
        }
      },
      {
        path: 'edit-shipment/:id',
        component: UnHoldShipmentComponent,
        data: {
          title: 'Shipment Details Edit',
          breadcrumb: 'Shipment Details Edit'
        }
      },
      {
        path: 'receive-shipment',
        component: ListShipmentReservedComponent,
        data: {
          title: 'Shipment List',
          breadcrumb: 'Shipment Receive List'
        }
      },
      {
        path: 'receive-shipment-make/:id',
        component: MakeReservedComponent,
        data: {
          title: 'Shipment Receive Make',
          breadcrumb: 'Shipment Receive Make'
        }
      },
      {
        path: 'selected-receive-shipment-make/:id/:i',
        component: RecievedShipmentComponent,
        data: {
          title: 'Selected Shipment Receive Make',
          breadcrumb: 'Selected Shipment Receive Make'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShipmentRoutingModule {
}
