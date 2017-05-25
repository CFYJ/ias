import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class User {
  constructor(
    public name: string,
    public password: string) { }
}

@Injectable()
export class AuthenticationService {

  constructor(
    private _router: Router,
    private http: Http
  ) { }

  logout() {
    localStorage.removeItem('user');
    this._router.navigate(['Login']);
  }

  loggedIn() {
    return tokenNotExpired();
  }

  login1(user) {
    let t = this.http.post('http://localhost:5000/api/ADAuthentication/IsAuthenticated', JSON.stringify(user))
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let user1 = response.json();
        if (user1 && user1.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user1));
        }
      });
  }

  login2(user) {
    let _self = this;
    let result: boolean;
    let token: any;
    $.ajax({
      cache: false,
      async: false,
      dataType: 'json',
      contentType: 'application/json',
      url: 'http://localhost:5000/api/ADAuthentication/IsAuthenticated',
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
    let _self = this;
    let result: boolean;
    let token: any;
    $.ajax({
      cache: false,
      async: false,
      dataType: 'text',
      contentType: 'application/json',
      url: 'http://localhost:5000/api/ADAuthentication/JwtAuthenticate',
      data: JSON.stringify(user),
      type: 'PUT',
      success: function (data: any, status: any, xhr: any) {
        // update command is executed.
        if (data) {
          token = data;
          result = true;
        } else {
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

  checkCredential() {
    if (localStorage.getItem('user') === null) {
      this._router.navigate(['Login']);
    }
  }


}
