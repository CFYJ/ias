import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export class User {
  constructor(
    public name: string,
    public password: string) { }
}

@Injectable()
export class AuthenticationService {

  constructor(
    private _router: Router
  ) { }

  logout() {
    localStorage.removeItem('user');
    this._router.navigate(['Login']);
  }

  login(user) {
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

  checkCredential() {
    if (localStorage.getItem('user') === null) {
      this._router.navigate(['Login']);
    }
  }


}
