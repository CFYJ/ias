import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/authentication.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthenticationService, private _router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
    //this._router.navigateByUrl('/login');
  }

}
