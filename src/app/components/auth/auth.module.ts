import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from '../../shared/shared.module';
import {httpInterceptorProviders} from '../../shared/auth/auth-interceptor';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordVerificationComponent } from './password-verification/password-verification.component';
import { NewPasswordComponent } from './new-password/new-password.component';


@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent, PasswordVerificationComponent, NewPasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    CarouselModule,
    SharedModule
  ],
  providers: [httpInterceptorProviders]
})
export class AuthModule { }
