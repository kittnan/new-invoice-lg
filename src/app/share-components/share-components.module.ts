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
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { SapSearchInvoiceComponent } from './sap-search-invoice/sap-search-invoice.component';
import { ViewerInvoiceNoCommonComponent } from './viewer-invoice-no-common/viewer-invoice-no-common.component';
import { ViewerPackingNoComComponent } from './viewer-packing-no-com/viewer-packing-no-com.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YY',
  },
  display: {
    dateInput: 'DD-MMM-YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [SubHeadComponent, Currency2Pipe, SearchInvoiceComponent, ViewerInvoiceComponent, ViewerPackingComponent, ViewerPacking2Component, SapSearchInvoiceComponent, ViewerInvoiceNoCommonComponent, ViewerPackingNoComComponent,],
  imports: [CommonModule, MaterialModule, FlexLayoutModule, FormsModule, ReactiveFormsModule],
  exports: [SubHeadComponent, Currency2Pipe, SearchInvoiceComponent, ViewerInvoiceComponent, ViewerPackingComponent, ViewerPacking2Component, SapSearchInvoiceComponent, ViewerInvoiceNoCommonComponent, ViewerPackingNoComComponent],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class ShareComponentsModule { }
