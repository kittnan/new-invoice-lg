import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
;
import { GenerateCommonComponent } from './1-generate/generate-common/generate-common.component';
import { CommonInvoiceRoutingModule } from './common-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareComponentsModule } from 'src/app/share-components/share-components.module';
import { MaterialModule } from 'src/material/material.module';


@NgModule({
  declarations: [
    GenerateCommonComponent
  ],
  imports: [
    CommonModule,
    CommonInvoiceRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ShareComponentsModule,
  ]
})
export class CommonInvoiceModule { }
