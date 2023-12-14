import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthAdminService {
  handleSideBarAuth(auth: string) {
    if (auth === 'admin') {
      return this.admin();
    }
    return [];
  }

  admin() {
    return [
      {
        title: 'admin',
        visible: false,
        icon:'verified_user',
        sub: [
          {
            name: 'ktc address',
            path: 'admin/ktc-address',
            active: false,
            icon:'home_pin'
          },
          {
            name: 'consignee code',
            path: 'admin/consignee-code',
            active: false,
            icon:'pin'
          },
          {
            name: 'consignee',
            path: 'admin/consignee',
            active: false,
            icon:'local_shipping'
          },
          // {
          //   name: 'accountee',
          //   path: 'admin/accountee',
          //   active: false,
          // },
          {
            name: 'item-code',
            path: 'admin/item-code',
            active: false,
            icon:'category'
          },
          {
            name: 'country',
            path: 'admin/country',
            active: false,
            icon:'location_city'
          },
          {
            name: 'model',
            path: 'admin/model',
            active: false,
            icon:'schema'
          },
          {
            name: 'users',
            path: 'admin/user',
            active: false,
            icon:'diversity_3'
          },
          {
            name: 'manage invoice',
            path: 'admin/manage-invoice',
            active: false,
            icon:'description'
          },
        ],
      },
    ];
  }
}
