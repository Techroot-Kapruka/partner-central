import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountsRoutingModule} from './accounts-routing.module';
import {PoListComponent} from './po-list/po-list.component';
import {CKEditorModule} from 'ngx-ckeditor';
import {NgbPaginationModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SalesOrderListComponent} from './sales-order-list/sales-order-list.component';


@NgModule({
  declarations: [
    PoListComponent,
    SalesOrderListComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    CKEditorModule,
    NgbTabsetModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    FormsModule,
  ]
})
export class AccountsModule {
}
