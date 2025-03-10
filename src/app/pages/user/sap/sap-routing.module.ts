import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SapGenerateInvoiceComponent } from './1-generate/sap-generate-invoice/sap-generate-invoice.component';
import { SapTablePrintComponent } from './table/sap-table-print/sap-table-print.component';
import { SapConfigInvoiceComponent } from './2-config/sap-config-invoice/sap-config-invoice.component';
import { SapConfigPackingComponent } from './2-config/sap-config-packing/sap-config-packing.component';
import { SapPrintInvoiceComponent } from './3-print/sap-print-invoice/sap-print-invoice.component';
import { SapPrintPackingComponent } from './3-print/sap-print-packing/sap-print-packing.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'generate-invoice',
    pathMatch: 'full',
  },
  {
    path: 'generate-invoice',
    component: SapGenerateInvoiceComponent,
  },
  {
    path: 'print',
    component: SapTablePrintComponent,
  },
  {
    path: 'config-invoice',
    component: SapConfigInvoiceComponent,
  },
  {
    path: 'config-packing',
    component: SapConfigPackingComponent,
  },
  {
    path: 'reprint-invoice',
    component: SapPrintInvoiceComponent,
  },
  {
    path: 'reprint-packing',
    component: SapPrintPackingComponent,
  },
  {
    path: '',
    component: SapTablePrintComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SapRoutingModule { }
