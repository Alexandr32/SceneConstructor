import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import {User} from "@firebase/auth";
import {Router} from "@angular/router";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // userData: Observable<firebase.User>;
  //
  // constructor(private angularFireAuth: AngularFireAuth) {
  //   this.userData = angularFireAuth.authState;
  // }

  user:  Observable<User>;
  constructor(public auth: AngularFireAuth) {
    this.user = auth.user.pipe(
      map(user => {
          if (user){
            localStorage.setItem('user', JSON.stringify(user));
          } else {
            localStorage.setItem('user', null);
          }
          return user
      })
    )
  }

  async login(mail: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(mail, password)
    } catch (error) {
      console.error(error)
    }
  }
  async logout() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error(error)
    }
  }

}
