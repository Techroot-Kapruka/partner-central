import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ListPaymentComponent} from './list-payment/list-payment.component';
import {PaymentWithdrawalComponent} from "./payment-withdrawal/payment-withdrawal.component";
import { PaymentRequestComponent } from './payment-request/payment-request.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-payment',
        component: ListPaymentComponent,
        data: {
          title: 'Payment List',
          breadcrumb: 'Payment List'
        }
      },
      {
        path: 'payment-withdrawal',
        component: PaymentWithdrawalComponent,
        data: {
          title: 'payment withdrawal',
          breadcrumb: 'payment withdrawal'
        }
      },
      {
        path: 'payment-request',
        component: PaymentRequestComponent,
        data: {
          title: 'payment request',
          breadcrumb: 'payment request '
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PaymentRoutingModule{}
