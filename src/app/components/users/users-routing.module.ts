import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListUserComponent} from './list-user/list-user.component';
import {CreateUserComponent} from './create-user/create-user.component';
import {ApprovePartnerComponent} from "./approve-partner/approve-partner.component";
import {PrivilegesUsersComponent} from "./privileges-users/privileges-users.component";
import {EditPartnerComponent} from "./edit-partner/edit-partner.component";
import {EditPartnerCategoryComponent} from "./edit-partner-category/edit-partner-category.component";
import {GuestUserComponent} from "./guest-user/guest-user.component";
import {CreatePartnerComponent} from "./create-partner/create-partner.component";
import {UserVerficationComponent} from "./user-verfication/user-verfication.component";
import {UserNotificationsComponent} from "./user-notifications/user-notifications.component";
import {AuthGuard} from "../../auth.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-user',
        component: ListUserComponent,
        data: {
          title: 'User List',
          breadcrumb: 'User List'
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
        data: {
          title: 'Create User',
          breadcrumb: 'Create User'
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'guest-user',
        component: GuestUserComponent,
        data: {
          title: 'Guest User',
          breadcrumb: 'Guest User'
        }
      },
      {
        path: 'view-partner/:id/:value',
        component: ApprovePartnerComponent,
        data: {
          title: 'Approve Partner',
          breadcrumb: 'Create User'
        }
      },
      {
        path: 'settings/profile/:id',
        component: EditPartnerComponent,
        data: {
          title: 'Update Partner Profile',
          breadcrumb: 'Update Partner Profile'
        }
      }
      ,
      {
        path: 'users-privileges',
        component: PrivilegesUsersComponent,
        data: {
          title: 'Privileges Users',
          breadcrumb: 'Privileges Users'
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'edit-partner-category/:id',
        component: EditPartnerCategoryComponent,
        data: {
          title: 'Edit Partner Category',
          breadcrumb: 'Edit Partner Category'
        }
      },
      {
        path: 'guest',
        component: CreatePartnerComponent,
        data: {
          title: 'Seller Account - Unverified',
          breadcrumb: 'guest-guest'
        }
      },
      {
        path: 'user-notifications',
        component: UserNotificationsComponent,
        data: {
          title: 'user notifications',
          breadcrumb: 'user notifications'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
