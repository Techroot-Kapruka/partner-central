import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PoListComponent} from './po-list/po-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'po-list-list',
        component: PoListComponent,
        data: {
          title: 'Purchase Order List',
          breadcrumb: 'Purchase Order List'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
