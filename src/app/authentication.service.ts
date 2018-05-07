import { SimpleGlobal } from 'ng2-simple-global';
import { async } from '@angular/core/testing';
import { Injectable, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Rx';

export class User {
  constructor(
    public name: string,
    public password: string) { }
}

@Injectable()
export class AuthenticationService {

  constructor(
    private _router: Router,
    private http: Http,
    private jwtHelper: JwtHelper = new JwtHelper(),
    private sg: SimpleGlobal
  ) { }

  logout() {
    localStorage.removeItem('user');
  }

  loggedIn(): boolean {
    const token = localStorage.getItem('user');
    if (tokenNotExpired(null, token)) {
        return true;
      } else {
        this.logout();
        return false;
      }
    // return tokenNotExpired(null, token);
  }

  getUser(): string {
    if (this.loggedIn) {
      const token = localStorage.getItem('user');
      if (token) {
        const user = this.jwtHelper.decodeToken(token).name;
        return user;
      } else {
        return '';
      }
    }
  }

  getUserData(): any {
    if (this.loggedIn) {
      const token = localStorage.getItem('user');
      if (token) {
        const userData = this.jwtHelper.decodeToken(token).userData;
        //const userData = this.jwtHelper.decodeToken(token)["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"];
        //console.log(userData);
        return userData;
      } else {
        return '';
      }
    }
  }

 
  getUserRole(): string {
    if (this.loggedIn) {
      const token = localStorage.getItem('user');
      if (token) {
        const role = this.jwtHelper.decodeToken(token).role;
        return role;
      } else {
        return '';
      }
    }
  }

  checkIfUserIsInRole(dataRow: any): boolean{

    if(this.loggedIn){
      const token = localStorage.getItem('user');

      if (token) {
        var role = this.jwtHelper.decodeToken(token)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if(role)
        var result = role.find(function(rola){ return rola.trim().toUpperCase() === dataRow.toUpperCase();});
        // console.log(result + ' wasl');
        if(result!='' && result!=null)                  
          {  
            return true;
          }
      }


    //************************************** obsługa starego tokena */
    //   if (token) {
    //     var role = this.jwtHelper.decodeToken(token).securityrole;
    //     if(role===null)
    //       return false;
    //     var role = role.split(",");
    //  // console.log(role);
    //     var result = role.find(function(rola){
    //                         return rola.trim().toUpperCase() === dataRow.toUpperCase();
    //                       });
    //     //console.log(result);
    //     if(result!='' && result!=null)                  
    //       {  
    //         return true;
    //       }
      
    //   }
    }
    return false;
  }

//#region metody uprawnien stare Piotrka do kontaktow
  checkIfUserHasPermissionToEdit(dataRow: any): boolean {
    const user = this.getUser();
    const userData = this.getUserData();
    const role = this.getUserRole();

    if (dataRow.pion === userData.Pion && dataRow.wydzial === userData.Wydzial
      && (role === 'Supervisor' || dataRow.login === user)) {
      return true;
    }
    if (role === 'Admin' || dataRow.login === user) {
      return true;
    }
    return false;
  }

  checkIfUserBelongsToITStaff(): boolean {
    const userData = this.getUserData();
    if (userData) {
      if (userData.Pion === 'P Informatyki' && userData.Wydzial === 'Wydział Informatyki') {
        return true;
      }
    }
    return false;
  }

  //#endregion

  login(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    return this.http.put(this.sg['HTTPS_SERVICE_URL'] + 'ADAuthentication/JwtAuthenticate1', JSON.stringify(user), { headers: headers })
      .map((response: Response) => {
        user = response.json();
        if (user && user.token) {
          localStorage.setItem('user', user.token);
         // console.log(localStorage.getItem('user'))
        }
      });
  }

  checkCredential() {
    if (localStorage.getItem('user') === null) {
      this._router.navigate(['Login']);
    }
  }

  isEditAllowed(data: any) {
    const user = localStorage.getItem('user');
  }


}
