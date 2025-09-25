import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoCommonInvoiceRoutingModule } from './no-common-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareComponentsModule } from 'src/app/share-components/share-components.module';
import { MaterialModule } from 'src/material/material.module';
import { GenerateNoCommonComponent } from './1-generate/generate-no-common/generate-no-common.component';
import { NoCommonConfigInvoiceComponent } from './2-config/no-common-config-invoice/no-common-config-invoice.component';
import { NoCommonConfigPackingComponent } from './2-config/no-common-config-packing/no-common-config-packing.component';
import { NoCommonPrintInvoiceComponent } from './3-print/no-common-print-invoice/no-common-print-invoice.component';
import { NoCommonPrintPackingComponent } from './3-print/no-common-print-packing/no-common-print-packing.component';
import { NoCommonTablePrintComponent } from './table/no-common-table-print/no-common-table-print.component';


@NgModule({
  declarations: [
    GenerateNoCommonComponent,
    NoCommonConfigInvoiceComponent,
    NoCommonConfigPackingComponent,
    NoCommonPrintInvoiceComponent,
    NoCommonPrintPackingComponent,
    NoCommonTablePrintComponent
  ],
  imports: [
    CommonModule,
    NoCommonInvoiceRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ShareComponentsModule,
  ]
})
export class NoCommonInvoiceModule { }
