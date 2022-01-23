import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthenticationService} from "../services/authentication-service.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {

  form: FormGroup;
  massage: string = ''

  constructor(public auth: AuthenticationService, private fb: FormBuilder) {
    this.form = fb.group({
      "mail": new FormControl("",
        [
          Validators.required,
          Validators.email
        ]
      ),
      "password": new FormControl("", [
        Validators.required,
        Validators.min(6)
      ])
    })
  }

  ngOnInit(): void {
  }

  async login() {
    this.massage = ''
    const mail: string = this.form.get('mail').value
    const password: string = this.form.get('password').value

    try {
      await this.auth.login(mail, password)
    } catch (error) {
      this.massage = 'Ошибка авторизации'
      console.error(error)
    }
  }

  async logout() {
    this.massage = ''
    try {
      await this.auth.logout();
    } catch (error) {
      console.error(error)
    }
  }

}
