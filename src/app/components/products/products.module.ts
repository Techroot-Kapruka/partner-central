import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {Ng2SmartTableModule} from 'ng2-smart-table';
import {CKEditorModule} from 'ngx-ckeditor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ProductsRoutingModule} from './products-routing.module';
import {GalleryModule} from '@ks89/angular-modal-gallery';
import 'hammerjs';
import 'mousetrap';

import {DropzoneModule} from 'ngx-dropzone-wrapper';
import {DROPZONE_CONFIG} from 'ngx-dropzone-wrapper';
import {DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import {DigitalAddComponent} from './add-product/digital-add.component';
import {DigitalListComponent} from './list-product/digital-list.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {EditProductsComponent} from './edit-products/edit-products.component';
import {ViewProductComponent} from './view-product/view-product.component';
import {ApproveProductComponent} from './approve-product/approve-product.component';
import {QaApprovalViewComponent} from './qa-approval-view/qa-approval-view.component';
import {QaNormalViewComponent} from './qa-normal-view/qa-normal-view.component';
import {DeclinedProductComponent} from './declined-product/declined-product.component';
import {ProductViewComponent} from './product-view/product-view.component';
import {ApproveEditProductComponent} from './approve-edit-product/approve-edit-product.component';
import {ApproveEditImageComponentComponent} from './approve-edit-image-component/approve-edit-image-component.component';
import {PaginationComponent} from './pagination/pagination.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {SelectModule} from 'ng-select';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {AnalyticsProductViewComponent} from './analytics-product-view/analytics-product-view.component';
import { ChangeRequestsComponent } from './product-list/change-requests/change-requests.component';
import { NewAdditionsComponent } from './product-list/new-additions/new-additions.component';
import { ProductSearchComponent } from './product-list/product-search/product-search.component';
import {SharedModule} from "../../shared/shared.module";

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  maxFilesize: 50,
  url: 'https://httpbin.org/post',
};

@NgModule({
  // declarations: [DigitalListComponent, DigitalAddComponent, EditProductsComponent, ViewProductComponent, ApproveProductComponent, QaApprovalViewComponent, QaNormalViewComponent, DeclinedProductComponent, ProductViewComponent, ApproveEditProductComponent, ApproveEditImageComponentComponent, PaginationComponent, AnalyticsProductViewComponent],
    declarations: [

        DigitalListComponent, DigitalAddComponent, EditProductsComponent, ViewProductComponent, ApproveProductComponent, QaApprovalViewComponent, QaNormalViewComponent, DeclinedProductComponent, ProductViewComponent, ApproveEditProductComponent, ApproveEditImageComponentComponent, PaginationComponent, ChangeRequestsComponent, NewAdditionsComponent, ProductSearchComponent, AnalyticsProductViewComponent],

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CKEditorModule,
        ProductsRoutingModule,
        Ng2SmartTableModule,
        NgbModule,
        DropzoneModule,
        GalleryModule.forRoot(),
        NgxDatatableModule,
        AngularEditorModule,
        SelectModule,
        NgxSkeletonLoaderModule,
      SharedModule,
    ],
    exports: [
        PaginationComponent,



    ],
    providers: [
        {
            provide: DROPZONE_CONFIG,
            useValue: DEFAULT_DROPZONE_CONFIG
        },
        NgbActiveModal
    ]

})
export class ProductsModule {
}
