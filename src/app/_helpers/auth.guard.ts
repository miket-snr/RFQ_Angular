import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private currentUser: string;
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {
    this.currentUser = '';
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const currentUser = this.authenticationService.currentUserValue;
    if (this.authenticationService.isAuthenticated()) {
      // check if route is restricted by role
      /*     if (
        route.data.roles &&
        route.data.roles.indexOf(currentUser.role) === -1
      ) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
*/
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
