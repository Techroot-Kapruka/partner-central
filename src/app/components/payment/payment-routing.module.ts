import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ListPaymentComponent} from './list-payment/list-payment.component';
import {PaymentWithdrawalComponent} from "./payment-withdrawal/payment-withdrawal.component";

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
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PaymentRoutingModule{}
