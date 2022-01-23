import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable, of} from "rxjs";
import {AuthenticationService} from "../editor/services/authentication-service.service";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authenticationService.isAuthorized()) {
      return true;
    }
    return this.resolveNavigationUrl(state);
  }

  private resolveNavigationUrl(state: RouterStateSnapshot): Observable<UrlTree> {

    return this.authenticationService.user$
      .pipe(
        map((user) => {
          return user ?
            this.router.parseUrl(state.url) :
            this.router.parseUrl('/login');
        }),
        catchError(() => of(this.router.parseUrl('/login')))
      );
  }
}
