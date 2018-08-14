import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityComponent } from './security.component';

import { FormsModule } from '@angular/forms';
import { AuthenticationService } from './../authentication.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { RouterTestingModule} from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';

import { jqxSplitterComponent} from 'jqwidgets-ts/angular_jqxsplitter';
import { jqxDropDownButtonComponent } from 'jqwidgets-ts/angular_jqxdropdownbutton';
import { jqxTreeComponent} from 'jqwidgets-ts/angular_jqxtree';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxColorPickerComponent} from 'jqwidgets-ts/angular_jqxcolorpicker';
import { jqxButtonComponent } from 'jqwidgets-ts/angular_jqxbuttons';
import { jqxTabsComponent} from 'jqwidgets-ts/angular_jqxtabs';
import { jqxToolBarComponent} from 'jqwidgets-ts/angular_jqxtoolbar';

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityComponent ,
        jqxSplitterComponent,
        jqxDropDownButtonComponent,
        jqxTreeComponent,
        jqxWindowComponent,
        jqxGridComponent,
        jqxColorPickerComponent,
        jqxButtonComponent,
        jqxTabsComponent,
        jqxToolBarComponent
      ],
      imports: [ 
        FormsModule, 
        RouterTestingModule, 
        HttpModule
      ],
      providers:[
        AuthenticationService,
        JwtHelper,
        SimpleGlobal
        ],
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
