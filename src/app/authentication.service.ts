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
    // private messageService: MessageService,
  ) { }

  logout() {
    localStorage.removeItem('user');
    // this.sendMessage('Aby móc edytować dane należy się zalogować');
    // this._router.navigate(['/login']);
  }

  loggedIn() {
    const token = localStorage.getItem('user');
    return tokenNotExpired(null, token);
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

  login1(user) {
    const t = this.http.post(this.sg['HTTPS_SERVICE_URL'] + 'ADAuthentication/JwtAuthenticate', JSON.stringify(user))
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        const user1 = response.json();
        if (user1 && user1.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user1));
        }
      });
  }

  login2(user) {
    const _self = this;
    let result: boolean;
    let token: any;
    $.ajax({
      cache: false,
      async: false,
      dataType: 'json',
      contentType: 'application/json',
      url: this.sg['HTTPS_SERVICE_URL'] + 'ADAuthentication/IsAuthenticated',
      data: JSON.stringify(user),
      type: 'PUT',
      success: function (data: any, status: any, xhr: any) {
        // update command is executed.
        if (data === true) {
          token = data;
          result = true;
        } else if (data === false) {
          result = false;
        }
      },
      error: function (jqXHR: any, textStatus: any, errorThrown: any) {
        alert(textStatus + ' - ' + errorThrown);
        return false;
      }
    });

    if (result === true) {
      localStorage.setItem('user', token);
      _self._router.navigate(['delegacje']);
      return true;
    } else {
      return false;
    }
  }

  login(user) {
    const _self = this;
    // let result: boolean;
    let token: any;

    // const t = this.http.post(this.sg['HTTPS_SERVICE_URL'] + 'ADAuthentication/JwtAuthenticate', JSON.stringify(user))
    //   .map((response: Response) => {
    //     // login successful if there's a jwt token in the response
    //     const user1 = response.json();
    //     if (user1 && user1.token) {
    //       // store user details and jwt token in local storage to keep user logged in between page refreshes
    //       localStorage.setItem('currentUser', JSON.stringify(user1));
    //     }
    //   });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    return this.http.put(this.sg['HTTPS_SERVICE_URL'] + 'ADAuthentication/JwtAuthenticate1', JSON.stringify(user), { headers: headers })
      .map((response: Response) => {
        user = response.json();
        if (user && user.token) {
          localStorage.setItem('user', user.token);
        }
      });
    // .subscribe(data => {
    //   token = data['results']
    //   result = true;
    // });

    // $.ajax({
    //   cache: false,
    //   async: false,
    //   dataType: 'text',
    //   contentType: 'application/json',
    //   url: this.sg['HTTPS_SERVICE_URL'] + 'ADAuthentication/JwtAuthenticate',
    //   data: JSON.stringify(user),
    //   type: 'PUT',
    //   success: function (data: any, status: any, xhr: any) {
    //     // update command is executed.
    //     if (data) {
    //       const d = _self.jwtHelper.decodeToken(data);
    //       token = data;
    //       result = true;
    //     } else {
    //       result = false;
    //     }
    //   },
    //   error: function (jqXHR: any, textStatus: any, errorThrown: any) {
    //     alert(textStatus + ' - ' + errorThrown);
    //     return false;
    //   }
    // });

    //   result = true;



    // if (result === true) {
    //   localStorage.setItem('user', token);
    //   // _self.sendMessage('Nie masz uprawnień do edycji tego rekordu. Możesz edytować jedynie swoje dane.');
    //   // _self._router.navigate(['delegacje']);
    //   return true;
    // } else {
    //   return false;
    // }
  }

  checkCredential() {
    if (localStorage.getItem('user') === null) {
      this._router.navigate(['Login']);
    }
  }

  isEditAllowed(data: any) {
    const user = localStorage.getItem('user');
    // if (user.role === 'kierownik' && data.)


  }


}
