import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate() {
    if (this.auth.loggedIn()) {
      return true;
    } else {
      this.router.navigateByUrl('login');
      return false;
    }

  }


}
