import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';

interface LoginFormResult {
  username: string
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  usernameInput!: HTMLInputElement
  passwordInput!: HTMLInputElement
  constructor(
    private $login: LoginService
  ) { }

  async ngOnInit(): Promise<void> {

    Swal.fire<LoginFormResult>({
      title: 'Login With SSO',
      html: `
        <input type="text" id="username" class="swal2-input" placeholder="Username">
        <input type="password" id="password" class="swal2-input" placeholder="Password">
      `,
      confirmButtonText: 'Sign in',
      focusConfirm: false,
      allowOutsideClick:false,
      allowEscapeKey:false,
      didOpen: () => {
        const popup = Swal.getPopup()!
        this.usernameInput = popup.querySelector('#username') as HTMLInputElement
        this.passwordInput = popup.querySelector('#password') as HTMLInputElement
        this.usernameInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
        this.passwordInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
      },
      preConfirm: async () => {
        const username = this.usernameInput.value
        const password = this.passwordInput.value
        if (username && password) {
          await this.$login.login({
            username:username,
            password:password
          })
        }
      },
      preDeny:()=>{
        return false
      }
    })

    // const { value: formValues } = await Swal.fire({
    //   title: 'Login With SSO',
    //   allowOutsideClick: false,
    //   confirmButtonText: 'Login',
    //   allowEnterKey: true,
    //   html:
    //     '<input id="swal-input1" class="swal2-input">' +
    //     '<input id="swal-input2" class="swal2-input" type="password">',
    //   focusConfirm: false,
    //   preConfirm: () => {
    //     let v1: any = document.getElementById('swal-input1')
    //     let v2: any = document.getElementById('swal-input2')
    //     return {
    //       username: v1.value,
    //       password: v2.value
    //     }
    //   }
    // })

    // if (formValues) {
    //   // Swal.fire(JSON.stringify(formValues))
    //   if (formValues.username && formValues.password) {
    //     await this.$login.login(formValues)
    //   }
    // }
  }

}
