import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  handleSideBarAuth(auth: string) {
    if (auth === 'user') {
      return this.user();
    }
    return [];
  }

  user() {
    return [
      {
        title: 'user',
        visible: false,
        icon: 'person',
        sub: [
          {
            name: 'generate invoice',
            path: 'user/generate-invoice',
            active: false,
            icon: 'post_add'
          },
          {
            name: 'print',
            path: 'user/print',
            active: false,
            icon: 'print'
          },
        ],
      },
      {
        title: 'common invoice',
        visible: false,
        icon: 'person',
        sub: [
          {
            name: 'generate invoice',
            path: 'user/common/generate-invoice',
            active: false,
            icon: 'post_add'
          },
          {
            name: 'print',
            path: 'user/common/print',
            active: false,
            icon: 'print'
          },
        ],
      },
      {
        title: 'SAP user',
        visible: false,
        icon: 'person',
        sub: [
          {
            name: 'generate invoice',
            path: 'user/sap/generate-invoice',
            active: false,
            icon: 'post_add'
          },
          {
            name: 'print',
            path: 'user/sap/print',
            active: false,
            icon: 'print'
          },
        ],
      },
    ];
  }
}
