import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';


import {FeatherIconsComponent} from './components/feather-icons/feather-icons.component';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';

import {ToggleFullscreenDirective} from './directives/fullscreen.directive';
import {ContentLayoutComponent} from './layout/content-layout/content-layout.component';
import {NavService} from './service/nav.service';
import {WINDOW_PROVIDERS} from './service/windows.service';
import {BreadcrumbComponent} from './components/breadcrumb/breadcrumb.component';
import {RightSidebarComponent} from './components/right-sidebar/right-sidebar.component';
import {PaymentService} from './service/payment.service';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import { TableTemplateComponent } from './table-template/table-template.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ToggleFullscreenDirective,
    FeatherIconsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ContentLayoutComponent,
    BreadcrumbComponent,
    RightSidebarComponent,
      ProgressBarComponent,
      TableTemplateComponent,
  ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
  providers: [NavService, WINDOW_PROVIDERS, PaymentService],
    exports: [FeatherIconsComponent, ToggleFullscreenDirective, ProgressBarComponent, ProgressBarComponent, TableTemplateComponent]
})
export class SharedModule {
}
