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

export const appRoutes: Routes = [
  { path: 'delegacje', component: DelegacjeComponent, canActivate: [AuthGuardService] },
  { path: 'kontakty', component: KontaktyComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: KontaktyComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DelegacjeComponent,
    KontaktyComponent,
    LoginComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [JwtHelper, AuthGuardService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
