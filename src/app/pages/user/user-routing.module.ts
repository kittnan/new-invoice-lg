import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'generate-invoice',
    pathMatch: 'full',
  },
  {
    path: 'generate-invoice',
    component: GenerateInvoiceComponent,
  },
  {
    path: 'view-invoice',
    component: ViewInvoiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
