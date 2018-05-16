import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.loggedIn()) {

      for(let element in route.data.role)    
        if(sessionStorage.getItem(route.data.role[element].trim().toUpperCase())==='1')
          return true;         
                        
      return false;
    } 
    else {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
      return false;
    }

  }


}
