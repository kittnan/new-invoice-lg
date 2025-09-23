import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateCommonComponent } from './1-generate/generate-common/generate-common.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'generate-invoice',
    pathMatch: 'full',
  },
  {
    path: 'generate-invoice',
    component: GenerateCommonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonInvoiceRoutingModule { }
