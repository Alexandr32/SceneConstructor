import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "@firebase/auth";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

/**
 * Сервис авторизации для входа в редактирование игр
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationEditorService {

  user$: Observable<User>;
  private user: User;

  constructor(public auth: AngularFireAuth, private router: Router) {
    this.user$ = auth.user.pipe(
      map(user => {
        this.user = user
        return user
      })
    )

    this.user$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    })
  }

  isAuthorized(): boolean {
    return !!this.user
  }

  async login(mail: string, password: string) {
    return this.auth.signInWithEmailAndPassword(mail, password)
  }

  async logout() {
    return this.auth.signOut();
  }

}
