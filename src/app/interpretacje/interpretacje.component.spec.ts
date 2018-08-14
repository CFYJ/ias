import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpretacjeComponent } from './interpretacje.component';

import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient,HttpClientModule, HttpHandler  } from '@angular/common/http';
import { RouterTestingModule} from '@angular/router/testing';
import { AuthenticationService } from './../authentication.service';
import { HttpModule } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { SimpleGlobal } from 'ng2-simple-global';
import { MessageService } from './../message.service';

import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';

describe('InterpretacjeComponent', () => {
  let component: InterpretacjeComponent;
  let fixture: ComponentFixture<InterpretacjeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule,RouterTestingModule, HttpModule ],

      declarations: [ 
        InterpretacjeComponent,
        jqxGridComponent,
        jqxWindowComponent,
        
        ],
      providers:[
        HttpClient, 
        AuthenticationService,
        HttpHandler,
        JwtHelper,
        SimpleGlobal,
        MessageService,
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterpretacjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
