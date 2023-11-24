import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KtcAddressComponent } from './ktc-address/ktc-address.component';
import { ConsigneeComponent } from './consignee/consignee.component';
import { AccounteeComponent } from './accountee/accountee.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'ktc-address',
    pathMatch: 'full',
  },
  {
    path: 'ktc-address',
    component: KtcAddressComponent,
  },
  {
    path: 'consignee',
    component: ConsigneeComponent,
  },
  {
    path: 'accountee',
    component: AccounteeComponent,
  },
  // {
  //   path: 'ktc-address',
  //   component: KtcAddressComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
