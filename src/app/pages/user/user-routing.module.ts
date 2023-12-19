import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { ViewPackingComponent } from './view-packing/view-packing.component';
import { ReprintInvoiceComponent } from './reprint-invoice/reprint-invoice.component';
import { ReprintPackingComponent } from './reprint-packing/reprint-packing.component';
import { ConfigInvoiceComponent } from './config-invoice/config-invoice.component';
import { ConfigPackingComponent } from './config-packing/config-packing.component';
import { ConfigPacking2Component } from './config-packing2/config-packing2.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'print',
    pathMatch: 'full',
  },
  {
    path: 'generate-invoice',
    component: GenerateInvoiceComponent,
  },
  {
    path: 'print',
    component: PrintInvoiceComponent,
  },
  {
    path: 'view-invoice',
    component: ViewInvoiceComponent,
  },
  {
    path: 'view-packing',
    component: ViewPackingComponent,
  },
  {
    path: 'reprint-invoice',
    component: ReprintInvoiceComponent,
  },
  {
    path: 'reprint-packing',
    component: ReprintPackingComponent,
  },
  {
    path: 'config-invoice',
    component: ConfigInvoiceComponent,
  },
  {
    path: 'config-packing',
    component: ConfigPacking2Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
