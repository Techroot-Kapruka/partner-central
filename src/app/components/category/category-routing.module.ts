import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CategoryComponent} from './category.component';
import {AuthGuard} from "../../auth.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'category',
        component: CategoryComponent,
        data: {
          title: 'Category',
          breadcrumb: 'Dashboard'
        },
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule {
}
