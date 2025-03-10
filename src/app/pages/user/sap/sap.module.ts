import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SapRoutingModule } from './sap-routing.module';
import { SapGenerateInvoiceComponent } from './1-generate/sap-generate-invoice/sap-generate-invoice.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareComponentsModule } from 'src/app/share-components/share-components.module';
import { MaterialModule } from 'src/material/material.module';
import { SapTablePrintComponent } from './table/sap-table-print/sap-table-print.component';
import { SapConfigInvoiceComponent } from './2-config/sap-config-invoice/sap-config-invoice.component';
import { SapConfigPackingComponent } from './2-config/sap-config-packing/sap-config-packing.component';
import { SapPrintInvoiceComponent } from './3-print/sap-print-invoice/sap-print-invoice.component';
import { SapPrintPackingComponent } from './3-print/sap-print-packing/sap-print-packing.component';


@NgModule({
  declarations: [
    SapGenerateInvoiceComponent,
    SapTablePrintComponent,
    SapConfigInvoiceComponent,
    SapConfigPackingComponent,
    SapPrintInvoiceComponent,
    SapPrintPackingComponent,
  ],
  imports: [
    CommonModule,
    SapRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ShareComponentsModule,
  ]
})
export class SapModule { }
