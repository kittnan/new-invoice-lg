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

@NgModule({
  declarations: [GenerateInvoiceComponent, ViewInvoiceComponent],
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
