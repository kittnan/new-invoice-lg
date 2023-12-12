import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private $login: LoginService,private router:Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(this.$login.get()){
        if(this.$login.get().auth_admin && this.$login.get().auth_admin == 'y'){
          return true
        }else{
          this.router.navigate(['user'])
        }
      }
    return false
  }

}
