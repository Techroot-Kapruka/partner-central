import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {UserVerficationComponent} from "../users/user-verfication/user-verfication.component";
import {PasswordVerificationComponent} from "./password-verification/password-verification.component";
import {NewPasswordComponent} from "./new-password/new-password.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'verifyOtp',
    component: UserVerficationComponent
  },
  {
    path: 'passwordVerification',
    component: PasswordVerificationComponent
  },
  {
    path: 'addNewPassword',
    component: NewPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
