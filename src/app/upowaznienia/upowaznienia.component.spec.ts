import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpowaznieniaComponent } from './upowaznienia.component';
import { UpowaznieniaService } from './../upowaznienia.service';
import { MessageService } from './../message.service';

import { FormsModule } from '@angular/forms';
import { AuthenticationService } from './../authentication.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { RouterTestingModule} from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { LinkyModule, LinkyPipe } from 'angular-linky';

import { jqxToolBarComponent} from 'jqwidgets-ts/angular_jqxtoolbar';
import { jqxSplitterComponent} from 'jqwidgets-ts/angular_jqxsplitter';
import { jqxDropDownButtonComponent } from 'jqwidgets-ts/angular_jqxdropdownbutton';
import { jqxTreeComponent} from 'jqwidgets-ts/angular_jqxtree';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxColorPickerComponent} from 'jqwidgets-ts/angular_jqxcolorpicker';
import { jqxButtonComponent } from 'jqwidgets-ts/angular_jqxbuttons';
import { jqxInputComponent } from 'jqwidgets-ts/angular_jqxinput';

describe('UpowaznieniaComponent', () => {
  let component: UpowaznieniaComponent;
  let fixture: ComponentFixture<UpowaznieniaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpowaznieniaComponent,
        jqxSplitterComponent,
        jqxDropDownButtonComponent,
        jqxTreeComponent,
        jqxWindowComponent,
        jqxGridComponent,
        jqxColorPickerComponent,
        jqxButtonComponent,
        jqxToolBarComponent,
        jqxInputComponent,
        LinkyPipe 
      ],
      imports: [ 
        FormsModule,
         RouterTestingModule, 
         HttpModule,
         
        ],
      providers:[
        AuthenticationService,
        JwtHelper,
        SimpleGlobal,
        UpowaznieniaService,
        MessageService
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpowaznieniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
