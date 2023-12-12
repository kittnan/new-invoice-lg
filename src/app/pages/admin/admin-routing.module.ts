import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KtcAddressComponent } from './ktc-address/ktc-address.component';
import { ConsigneeComponent } from './consignee/consignee.component';
import { AccounteeComponent } from './accountee/accountee.component';
import { ConsigneeCodeComponent } from './consignee-code/consignee-code.component';
import { ItemCodeComponent } from './item-code/item-code.component';
import { CountryComponent } from './country/country.component';
import { ModelComponent } from './model/model.component';
import { UserComponent } from './user/user.component';

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
    path: 'consignee-code',
    component: ConsigneeCodeComponent,
  },
  // {
  //   path: 'accountee',
  //   component: AccounteeComponent,
  // },
  {
    path: 'item-code',
    component: ItemCodeComponent,
  },
  {
    path: 'country',
    component: CountryComponent,
  },
  {
    path: 'model',
    component: ModelComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
