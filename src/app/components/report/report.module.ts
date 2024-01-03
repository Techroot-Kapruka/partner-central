import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { CategoryReportComponent } from './category-report/category-report.component';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProductReportComponent } from './product-report/product-report.component';
import { VendorReportComponent } from './vendor-report/vendor-report.component';
import { ItemwiseShipmentReportComponent } from './itemwise-shipment-report/itemwise-shipment-report.component';
import {ProductsModule} from "../products/products.module";
import { ItemwiseSalesReportComponent } from './itemwise-sales-report/itemwise-sales-report.component';


@NgModule({
  declarations: [
    CategoryReportComponent,
    ProductReportComponent,
    VendorReportComponent,
    ItemwiseShipmentReportComponent,
    ItemwiseSalesReportComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReportRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ProductsModule,
  ]
})
export class ReportModule { }
