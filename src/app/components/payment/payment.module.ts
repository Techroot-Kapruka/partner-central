import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {PaymentRoutingModule} from './payment-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaymentWithdrawalComponent } from './payment-withdrawal/payment-withdrawal.component';
import { PaymentRequestComponent } from './payment-request/payment-request.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [ListPaymentComponent, PaymentWithdrawalComponent, PaymentRequestComponent],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        PaymentRoutingModule,
        NgxDatatableModule,
        SharedModule
    ]
})
export class PaymentModule { }
