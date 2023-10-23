import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CreatePartnerComponent } from './create-partner/create-partner.component';
import { ApprovePartnerComponent } from './approve-partner/approve-partner.component';
import { PrivilegesUsersComponent } from './privileges-users/privileges-users.component';
import { EditPartnerComponent } from './edit-partner/edit-partner.component';
import { EditPartnerCategoryComponent } from './edit-partner-category/edit-partner-category.component';
import { GuestUserComponent } from './guest-user/guest-user.component';
import { UserVerficationComponent } from './user-verfication/user-verfication.component';
import { UserNotificationsComponent } from './user-notifications/user-notifications.component';

@NgModule({ declarations: [ListUserComponent, CreateUserComponent, CreatePartnerComponent, ApprovePartnerComponent, PrivilegesUsersComponent, EditPartnerComponent, EditPartnerCategoryComponent, GuestUserComponent, UserVerficationComponent, UserNotificationsComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    NgxDatatableModule
  ]
})
export class UsersModule { }
