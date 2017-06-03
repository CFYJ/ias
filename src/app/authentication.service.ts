//import { MessageService } from './message.service';
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
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
    //private messageService: MessageService,
  ) { this.logout(); }

  logout() {
    localStorage.removeItem('user');
    //this.sendMessage('Aby móc edytować dane należy się zalogować');
    //this._router.navigate(['Login']);
  }

  loggedIn() {
    let token = localStorage.getItem('user');
    return tokenNotExpired(null, token);
  }

  getUser(): string {
    if (this.loggedIn) {
      let token = localStorage.getItem('user');
      if (token) {
        let user = this.jwtHelper.decodeToken(token).name;
        return user;
      } else {
        return '';
      }
    }
  }


  login1(user) {
    let t = this.http.post('http://localhost:5000/api/ADAuthentication/JwtAuthenticate', JSON.stringify(user))
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

    let t = this.http.post('http://localhost:5000/api/ADAuthentication/JwtAuthenticate', JSON.stringify(user))
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let user1 = response.json();
        if (user1 && user1.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user1));
        }
      });

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
          let d = _self.jwtHelper.decodeToken(data);
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

 //   result = true;

    if (result === true) {
      localStorage.setItem('user', token);
      //_self.sendMessage('Nie masz uprawnień do edycji tego rekordu. Możesz edytować jedynie swoje dane.');
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
