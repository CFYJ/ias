import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Router, Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DelegacjeComponent } from './delegacje/delegacje.component';
import { KontaktyComponent } from './kontakty/kontakty.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';

const appRoutes: Routes = [
  { path: 'delegacje', component: DelegacjeComponent },
  { path: 'kontakty', component: KontaktyComponent },
  { path: 'login', component: LoginComponent },
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
