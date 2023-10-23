import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { CategoryReportComponent } from './category-report/category-report.component';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProductReportComponent } from './product-report/product-report.component';
import { VendorReportComponent } from './vendor-report/vendor-report.component';


@NgModule({
  declarations: [
    CategoryReportComponent,
    ProductReportComponent,
    VendorReportComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReportRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
  ]
})
export class ReportModule { }
