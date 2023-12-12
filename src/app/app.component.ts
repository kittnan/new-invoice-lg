import { Component } from '@angular/core';
import { AuthAdminService } from './services/sidebars/auth-admin.service';
import { Router } from '@angular/router';
import { AuthUserService } from './services/sidebars/auth-user.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { LoginService } from './services/login/login.service';

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
    private router: Router,
    private $login: LoginService
  ) {}

  ngOnInit(): void {
    try {
      if(this.$login.get()){
        if(this.$login.get().auth_admin=='y'){
          this.handleSideBar('admin');
        }else{

          this.handleSideBar('user');
        }
      }


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
      // this.pageActive = sub.name;
    });
  }
  handleView() {
    if (localStorage.getItem('new-invoice-lg-view') == 'true') return true;
    return false;
  }
  ngAfterContentChecked(): void {
    this.pageActive = this.router.url
  }

  handleLogout(){
    Swal.fire({
      title:"Sign out?",
      icon:'question',
      showCancelButton:true
    }).then((v:SweetAlertResult)=>{
      if(v.isConfirmed){
        this.logout()
      }
    })
  }
  logout(){
    try {
      localStorage.removeItem('INVLG_user')
        this.router.navigate(['login']).then(()=>location.reload())
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }
  validateLogin(){
    return this.$login.validate()
  }
  showUserLogin(){
    if(this.$login.get()){
      return this.$login.get().name
    }
    return ''
  }
  ngOnDestroy(): void {
    localStorage.removeItem('INVLG_user')

  }
}
