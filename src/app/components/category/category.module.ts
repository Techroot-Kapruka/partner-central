import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import {CategoryRoutingModule} from './category-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



@NgModule({
  declarations: [
       CategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ]
})
export class CategoryModule { }
