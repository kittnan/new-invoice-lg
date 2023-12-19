import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareComponentsModule } from 'src/app/share-components/share-components.module';
import { MaterialModule } from 'src/material/material.module';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { ViewPackingComponent } from './view-packing/view-packing.component';
import { ReprintInvoiceComponent } from './reprint-invoice/reprint-invoice.component';
import { ReprintPackingComponent } from './reprint-packing/reprint-packing.component';
import { ConfigInvoiceComponent } from './config-invoice/config-invoice.component';
import { ConfigPackingComponent } from './config-packing/config-packing.component';
import { ConfigPacking2Component } from './config-packing2/config-packing2.component';

@NgModule({
  declarations: [GenerateInvoiceComponent, ViewInvoiceComponent, PrintInvoiceComponent, ViewPackingComponent, ReprintInvoiceComponent, ReprintPackingComponent, ConfigInvoiceComponent, ConfigPackingComponent, ConfigPacking2Component],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ShareComponentsModule,
  ],
})
export class UserModule {}
