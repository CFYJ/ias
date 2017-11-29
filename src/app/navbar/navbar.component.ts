import { Router } from '@angular/router';
import { Component, OnInit, ViewChild , AfterViewInit} from '@angular/core';
import { AuthenticationService } from 'app/authentication.service';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('jqxwindow1') editWindow: jqxWindowComponent;

  constructor(public auth: AuthenticationService, private _router: Router) { }



  ngOnInit() {
  }
  ngAfterViewInit(){

    this.editWindow.createWidget({
      width: 450, height: 430, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5
    });

  }

  logout() {
    this.auth.logout();
    //this._router.navigateByUrl('/login');
  }

  showInfo(){
    this.editWindow.title('Informacje');
    this.editWindow.open();
  }

}
