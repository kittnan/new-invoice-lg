import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private URL = environment.API;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  validate() {
    if (localStorage.getItem('DIS_user')) return true
    return false
  }
  get() {
    let user: any = localStorage.getItem('DIS_user')
    if (user) {
      user = JSON.parse(user)
      return user
    } else {
      return null

    }
  }
  async login(data: any) {
    try {
      const resData: any = await this.http.post(`${this.URL}/users/login`, data).toPromise()
      if (resData && resData.length > 0) {
        const userStr = JSON.stringify(resData[0])
        localStorage.setItem('DIS_user', userStr)
        if (resData[0].auth_admin) {
          this.router.navigate(['user']).then(() => location.reload())
        } else {
          this.router.navigate(['user']).then(() => location.reload())
        }
      } else {
        Swal.showValidationMessage(`Please enter username and password`)
        setTimeout(() => {
          // location.reload()
        }, 1000);
      }
    } catch (error) {
      console.log("🚀 ~ error:", error)
      Swal.fire('Login fail', '', 'error')
      setTimeout(() => {
        location.reload()
      }, 1000);
    }

  }
}
