import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { ViewPackingComponent } from './view-packing/view-packing.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
