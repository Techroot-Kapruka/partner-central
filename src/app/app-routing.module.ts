import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { content } from './shared/routes/content-routes';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import {CreatePartnerComponent} from "./components/users/create-partner/create-partner.component";
import {MessageComponent} from "./components/message/message.component";
import {UserVerficationComponent} from "./components/users/user-verfication/user-verfication.component";
import {ResolveGuard} from "./services/resolve.guard";
import {DeclinedMessageComponent} from "./components/declined-message/declined-message.component";
import {AuthGuard} from "./auth.guard";
import {PasswordVerificationComponent} from "./components/auth/password-verification/password-verification.component";
import {NewPasswordComponent} from "./components/auth/new-password/new-password.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
    resolve: {data: ResolveGuard},
    // canActivate: [AuthGuard]
  },
  {
    path: '',
    component: ContentLayoutComponent,
    children: content,
    resolve: {data: ResolveGuard}
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    resolve: {data: ResolveGuard}
  },
  {
    path: 'partner',
    component: CreatePartnerComponent,
    resolve: {data: ResolveGuard}
    // canActivate: [AuthGuard]
  },
  {
    path: 'user-verification/:id',
    component: UserVerficationComponent,
    resolve: {data: ResolveGuard},
    // canActivate: [AuthGuard]
  },
  {
    path: 'password-verification/:id',
    component: PasswordVerificationComponent,
    resolve: {data: ResolveGuard},
    // canActivate: [AuthGuard]
  },
  {
    path: 'new-password/:id',
    component: NewPasswordComponent,
    resolve: {data: ResolveGuard},
    // canActivate: [AuthGuard]
  },
  {
    path: 'message',
    component: MessageComponent,
    resolve: {data: ResolveGuard},
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'declined-message/:id',
    component: DeclinedMessageComponent,
    resolve: {data: ResolveGuard},
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
