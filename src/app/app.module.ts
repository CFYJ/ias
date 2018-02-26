import { MessageService } from './message.service';
import { KontaktyService } from './kontakty.service';
import { AuthenticationService } from './authentication.service';
import { UpowaznieniaService } from './upowaznienia.service';
//import { SecurityService } from './security.service';
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
import { jqxDropDownListComponent } from 'jqwidgets-ts/angular_jqxdropdownlist';
import { jqxPanelComponent} from 'jqwidgets-ts/angular_jqxpanel';
import { jqxToolBarComponent} from 'jqwidgets-ts/angular_jqxtoolbar';
import { jqxFileUploadComponent} from 'jqwidgets-ts/angular_jqxfileupload';
import { jqxTreeComponent} from 'jqwidgets-ts/angular_jqxtree';
import { jqxSplitterComponent} from 'jqwidgets-ts/angular_jqxsplitter';
import { jqxListBoxComponent} from 'jqwidgets-ts/angular_jqxlistbox';
import { jqxTabsComponent} from 'jqwidgets-ts/angular_jqxtabs';
//import { jqxDragDropComponent} from 'jqwidgets-ts/angular_jqxdragdrop';

import * as $ from 'jquery'

import {SimpleGlobal} from 'ng2-simple-global';
import { UpowaznieniaComponent } from './upowaznienia/upowaznienia.component'


//*******************google maps****************/
import { CommonModule } from '@angular/common';
import { AgmCoreModule, GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { SecurityComponent } from './security/security.component';

//******************* moduł zamieniający adresy www, email na linki ************/
import { LinkyModule } from 'angular-linky';
import { AnalizaGraficznaComponent } from './analiza-graficzna/analiza-graficzna.component';

//**********************************************/

export const appRoutes: Routes = [
  // { path: 'delegacje', component: DelegacjeComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/kontakty', pathMatch: 'full' },
  { path: 'wiskas', redirectTo: '/kontakty', pathMatch: 'full' },
  // { path: '', component: LoginComponent },
  { path: 'kontakty', component: KontaktyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: KontaktyComponent },
  { path: 'upowaznienia', component: UpowaznieniaComponent },
  { path: 'security', component: SecurityComponent},
  { path: 'analizagraficzna', component: AnalizaGraficznaComponent},
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
    jqxDropDownListComponent,    
    AppComponent,
    DelegacjeComponent,
    KontaktyComponent,
    LoginComponent,
    UpowaznieniaComponent,
    SecurityComponent,
    jqxPanelComponent,
    jqxToolBarComponent,
    jqxFileUploadComponent,
    jqxTreeComponent,
    jqxSplitterComponent,
    jqxListBoxComponent,
    jqxTabsComponent,
    AnalizaGraficznaComponent,
    //jqxDragDropComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
 //   DataTableModule,
 //   SharedModule,
    RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDI-66KWWgzNaqY3O5tccOr5PGcozgS_N0'
    }),  
    AgmJsMarkerClustererModule,
    LinkyModule,
  ],
  providers: [JwtHelper, AuthGuardService, AuthenticationService, KontaktyService, MessageService, SimpleGlobal,UpowaznieniaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
