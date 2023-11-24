import { Component } from '@angular/core';
import { AuthAdminService } from './services/sidebars/auth-admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sideBarsItems: any[] = [];
  pageActive: string = '';
  constructor(private $sidebar: AuthAdminService, private router: Router) {}

  ngOnInit(): void {
    try {
      this.handleSideBar('admin');
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }

  handleSideBar(auth: string) {
    this.sideBarsItems = this.$sidebar.handleSideBarAuth(auth);
  }
  link(sub: any) {
    this.router.navigate([sub.path]).then(() => {
      this.pageActive = sub.name;
    });
  }
}
