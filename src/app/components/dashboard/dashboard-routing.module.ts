import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {AuthGuard} from '../../auth.guard';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'default',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Dashboard',
          breadcrumb: 'Dashboard'
        }
      },
      {
        path: 'default/:partnerId/:bool',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Dashboard',
          breadcrumb: 'Dashboard'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
