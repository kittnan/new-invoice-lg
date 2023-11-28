import { Component } from '@angular/core';
import { AuthAdminService } from './services/sidebars/auth-admin.service';
import { Router } from '@angular/router';
import { AuthUserService } from './services/sidebars/auth-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sideBarsItems: any[] = [];
  pageActive: string = '';
  constructor(
    private $admin: AuthAdminService,
    private $user: AuthUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      this.handleSideBar('admin');
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }

  handleSideBar(auth: string) {
    if (auth == 'admin') {
      const admin = this.$admin.handleSideBarAuth(auth);
      const user = this.$user.handleSideBarAuth('user');
      this.sideBarsItems = [...admin, ...user];
    } else {
      this.sideBarsItems = this.$user.handleSideBarAuth('user');
    }
  }
  link(sub: any) {
    this.router.navigate([sub.path]).then(() => {
      this.pageActive = sub.name;
    });
  }
  handleView() {
    if (localStorage.getItem('new-invoice-lg-view') == 'true') return true;
    return false;
  }
}
