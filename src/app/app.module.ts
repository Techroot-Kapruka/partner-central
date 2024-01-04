import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardModule} from './components/dashboard/dashboard.module';
import {SharedModule} from './shared/shared.module';
import {ProductsModule} from './components/products/products.module';
import {UsersModule} from './components/users/users.module';
import {AuthModule} from './components/auth/auth.module';
import {FileModule} from './components/file/file.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {OrdersModule} from './components/orders/orders.module';
import {PaymentModule} from './components/payment/payment.module';
import {ShipmentModule} from './components/shipment/shipment.module';
import {httpInterceptorProviders} from './shared/auth/auth-interceptor';
import {AuthGuard} from './auth.guard';
import {OrderService} from './shared/service/order.service';
import {PaginationDirective} from './directives/pagination.directive';
import {FileUploadService} from './shared/service/file-upload.service';
import {CategoryModule} from './components/category/category.module';
import {CategoryService} from './shared/service/category.service';
import {DashboardService} from './shared/service/dashboard.service';
import {HttpClientService} from './shared/service/http-client.service';
import {NavService} from './shared/service/nav.service';
import {PaymentService} from './shared/service/payment.service';
import {ProductService} from './shared/service/product.service';
import {AuthService} from './shared/auth/auth.service';
import {MessageComponent} from './components/message/message.component';
import {ShipmentNewService} from "./shared/service/shipment-new.service";
import {PrivilegeUserService} from "./shared/service/privilege-user.service";
import { LoadingComponent } from './components/loading/loading.component';
import { ImageviewerComponent } from './components/imageviewer/imageviewer.component';
import { DeclinedMessageComponent } from './components/declined-message/declined-message.component';
import {PriceChangeService} from "./shared/service/price-change.service";
import {AnalyticsProductService} from "./shared/service/analytics-product.service";

@NgModule({
  declarations: [
    AppComponent,
    PaginationDirective,
    MessageComponent,
    LoadingComponent,
    DeclinedMessageComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
    DashboardModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    FileModule,
    CategoryModule,
    PaymentModule,
    ShipmentModule,
    SharedModule,
    NgbModule
  ],
  providers: [
    httpInterceptorProviders, AuthGuard, OrderService, FileUploadService, CategoryService, ShipmentNewService, PriceChangeService, PrivilegeUserService,
    DashboardService, HttpClientService, NavService, AnalyticsProductService, PaymentService, ProductService, AuthService, {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

// {provide: LocationStrategy, useClass: HashLocationStrategy}
