import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KontaktyComponent } from './kontakty.component';
import { KontaktyService } from './../kontakty.service';

import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { SimpleGlobal } from 'ng2-simple-global';
import { AuthenticationService } from './../authentication.service';
import { RouterTestingModule} from '@angular/router/testing';
import { JwtHelper } from 'angular2-jwt';
import { MessageService } from './../message.service';

import { jqxTabsComponent} from 'jqwidgets-ts/angular_jqxtabs';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxButtonComponent } from 'jqwidgets-ts/angular_jqxbuttons';
import { jqxSplitterComponent} from 'jqwidgets-ts/angular_jqxsplitter';
import { jqxTreeComponent} from 'jqwidgets-ts/angular_jqxtree';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';
import { jqxInputComponent } from 'jqwidgets-ts/angular_jqxinput';
import { jqxListBoxComponent } from 'jqwidgets-ts/angular_jqxlistbox';
import { jqxDropDownListComponent } from 'jqwidgets-ts/angular_jqxdropdownlist';
import { jqxNotificationComponent } from 'jqwidgets-ts/angular_jqxnotification';

import { AgmCoreModule, GoogleMapsAPIWrapper, MapsAPILoader, AgmMap, AgmMarker, AgmInfoWindow  } from '@agm/core';
import { AgmJsMarkerClustererModule, AgmMarkerCluster } from '@agm/js-marker-clusterer';

describe('KontaktyComponent', () => {
  let component: KontaktyComponent;
  let fixture: ComponentFixture<KontaktyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KontaktyComponent,
        jqxTabsComponent,
        jqxGridComponent,
        jqxButtonComponent,
        jqxSplitterComponent,
        jqxTreeComponent,
        jqxWindowComponent,
        jqxInputComponent,
        jqxListBoxComponent,
        AgmMap,
        AgmMarker,
        AgmMarkerCluster,
        AgmInfoWindow,
        jqxDropDownListComponent,
        jqxNotificationComponent,

       ],
      imports: [ 
        FormsModule, 
        RouterTestingModule, 
        HttpModule,
        
      ],
      providers:[
        AuthenticationService ,
        MapsAPILoader,
        //AgmJsMarkerClustererModule,
        KontaktyService,
        SimpleGlobal,
        JwtHelper,
        MessageService,
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KontaktyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
