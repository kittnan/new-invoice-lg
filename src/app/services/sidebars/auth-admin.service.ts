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
        sub: [
          {
            name: 'ktc address',
            path: 'admin/ktc-address',
            active: false,
          },
          {
            name: 'consignee code',
            path: 'admin/consignee-code',
            active: false,
          },
          {
            name: 'consignee',
            path: 'admin/consignee',
            active: false,
          },
          {
            name: 'accountee',
            path: 'admin/accountee',
            active: false,
          },
        ],
      },
    ];
  }
}
