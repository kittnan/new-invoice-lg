import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateNoCommonComponent } from './1-generate/generate-no-common/generate-no-common.component';
import { NoCommonConfigInvoiceComponent } from './2-config/no-common-config-invoice/no-common-config-invoice.component';
import { NoCommonConfigPackingComponent } from './2-config/no-common-config-packing/no-common-config-packing.component';
import { NoCommonPrintInvoiceComponent } from './3-print/no-common-print-invoice/no-common-print-invoice.component';
import { NoCommonPrintPackingComponent } from './3-print/no-common-print-packing/no-common-print-packing.component';
import { NoCommonTablePrintComponent } from './table/no-common-table-print/no-common-table-print.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'generate-invoice',
    pathMatch: 'full',
  },
  {
    path: 'generate-invoice',
    component: GenerateNoCommonComponent,
  },
  {
    path: 'print',
    component: NoCommonTablePrintComponent,
  },
  {
    path: 'config-invoice',
    component: NoCommonConfigInvoiceComponent,
  },
  {
    path: 'config-packing',
    component: NoCommonConfigPackingComponent,
  },
  {
    path: 'reprint-invoice',
    component: NoCommonPrintInvoiceComponent,
  },
  {
    path: 'reprint-packing',
    component: NoCommonPrintPackingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoCommonInvoiceRoutingModule { }
