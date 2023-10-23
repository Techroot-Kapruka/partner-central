import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListShipmentComponent } from './list-shipment/list-shipment.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {ShipmentRoutingModule} from './shipment-routing.module';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EditShipmentComponent } from './edit-shipment/edit-shipment.component';
import { UnHoldShipmentComponent } from './un-hold-shipment/un-hold-shipment.component';
import { MakeReservedComponent } from './make-reserved/make-reserved.component';
import { ListShipmentReservedComponent } from './list-shipment-reserved/list-shipment-reserved.component';
import { RecievedShipmentComponent } from './recieved-shipment/recieved-shipment.component';


@NgModule({
  declarations: [ListShipmentComponent, AddShipmentComponent, EditShipmentComponent, UnHoldShipmentComponent, MakeReservedComponent, ListShipmentReservedComponent, RecievedShipmentComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    ShipmentRoutingModule,
    NgxDatatableModule
  ]
})
export class ShipmentModule { }
