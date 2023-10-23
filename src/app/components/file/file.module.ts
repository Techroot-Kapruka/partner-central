import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FileRoutingModule } from './file-routing.module';
import { FileComponent } from './file.component';
import {DropzoneModule} from 'ngx-dropzone-wrapper';


@NgModule({
  declarations: [
    FileComponent
  ],
    imports: [
        CommonModule,
        FileRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        DropzoneModule
    ]
})
export class FileModule { }
