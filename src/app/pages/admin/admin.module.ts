import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ConsigneeComponent } from './consignee/consignee.component';
import { KtcAddressComponent } from './ktc-address/ktc-address.component';
import { MaterialModule } from 'src/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShareComponentsModule } from 'src/app/share-components/share-components.module';
import { ConsigneeCodeComponent } from './consignee-code/consignee-code.component';
import { ItemCodeComponent } from './item-code/item-code.component';
import { CountryComponent } from './country/country.component';
import { ModelComponent } from './model/model.component';
import { UserComponent } from './user/user.component';
import { ManageInvoiceComponent } from './manage-invoice/manage-invoice.component';

@NgModule({
  declarations: [ConsigneeComponent, KtcAddressComponent, ConsigneeCodeComponent, ItemCodeComponent, CountryComponent, ModelComponent, UserComponent, ManageInvoiceComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ShareComponentsModule,
  ],
})
export class AdminModule { }
