import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubHeadComponent } from './sub-head/sub-head.component';
import { MaterialModule } from 'src/material/material.module';
import { Currency2Pipe } from '../pipes/currency2.pipe';
import { SearchInvoiceComponent } from './search-invoice/search-invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewerInvoiceComponent } from './viewer-invoice/viewer-invoice.component';
import { ViewerPackingComponent } from './viewer-packing/viewer-packing.component';
import { ViewerPacking2Component } from './viewer-packing2/viewer-packing2.component';

@NgModule({
  declarations: [SubHeadComponent, Currency2Pipe, SearchInvoiceComponent, ViewerInvoiceComponent, ViewerPackingComponent, ViewerPacking2Component],
  imports: [CommonModule, MaterialModule, FlexLayoutModule, FormsModule, ReactiveFormsModule],
  exports: [SubHeadComponent, Currency2Pipe, SearchInvoiceComponent,ViewerInvoiceComponent,ViewerPackingComponent, ViewerPacking2Component],
})
export class ShareComponentsModule { }
