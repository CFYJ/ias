import { MessageService } from './message.service';
import { KontaktyService } from './kontakty.service';
import { AuthenticationService } from './authentication.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Router, Routes, RouterModule } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule } from '@angular/material';

import { AppComponent } from './app.component';
import { DelegacjeComponent } from './delegacje/delegacje.component';
import { KontaktyComponent } from './kontakty/kontakty.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthGuardService } from './auth-guard.service';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';
import { jqxButtonComponent } from 'jqwidgets-ts/angular_jqxbuttons';
import { jqxInputComponent } from 'jqwidgets-ts/angular_jqxinput';
import { jqxDateTimeInputComponent } from 'jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxComboBoxComponent } from 'jqwidgets-ts/angular_jqxcombobox';
import { jqxNotificationComponent } from 'jqwidgets-ts/angular_jqxnotification';

import {SimpleGlobal} from 'ng2-simple-global'

export const appRoutes: Routes = [
  // { path: 'delegacje', component: DelegacjeComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/kontakty', pathMatch: 'full' },
  // { path: '', component: LoginComponent },
  { path: 'kontakty', component: KontaktyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: KontaktyComponent },
];

@NgModule({
  declarations: [
    NavbarComponent,
    jqxGridComponent,
    jqxWindowComponent,
    jqxButtonComponent,
    jqxInputComponent,
    jqxDateTimeInputComponent,
    jqxComboBoxComponent,
    jqxNotificationComponent,
    AppComponent,
    DelegacjeComponent,
    KontaktyComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
 //   DataTableModule,
 //   SharedModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [JwtHelper, AuthGuardService, AuthenticationService, KontaktyService, MessageService, SimpleGlobal],
  bootstrap: [AppComponent]
})
export class AppModule { }
