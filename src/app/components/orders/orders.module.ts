import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOrdersComponent } from './list-orders/list-orders.component';
import {OrdersRoutingModule} from './orders-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { PoListComponent } from './po-list/po-list.component';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';


@NgModule({
  declarations: [ListOrdersComponent, ViewOrdersComponent, PoListComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    OrdersRoutingModule,
    NgxDatatableModule,
    NgxSkeletonLoaderModule
  ]
})
export class OrdersModule { }
