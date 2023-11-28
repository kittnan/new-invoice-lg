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
        sub: [
          {
            name: 'generate invoice',
            path: 'user/generate-invoice',
            active: false,
          },
        ],
      },
    ];
  }
}
