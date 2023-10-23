import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FileComponent} from './file.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'file',
        component: FileComponent,
        data: {
          title: 'Bulk Product Upload',
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
export class FileRoutingModule {
}
