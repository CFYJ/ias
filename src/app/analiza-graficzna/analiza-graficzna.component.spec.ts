
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalizaGraficznaComponent } from './analiza-graficzna.component';
import { jqxSplitterComponent} from 'jqwidgets-ts/angular_jqxsplitter';
import { jqxDropDownButtonComponent } from 'jqwidgets-ts/angular_jqxdropdownbutton';
import { jqxTreeComponent} from 'jqwidgets-ts/angular_jqxtree';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxColorPickerComponent} from 'jqwidgets-ts/angular_jqxcolorpicker';
import { jqxButtonComponent } from 'jqwidgets-ts/angular_jqxbuttons';




import { FormsModule } from '@angular/forms';
import { AuthenticationService } from './../authentication.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { RouterTestingModule} from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';


import * as $ from "jquery";

describe('AnalizaGraficznaComponent', () => {
  let component: AnalizaGraficznaComponent;
  let fixture: ComponentFixture<AnalizaGraficznaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule, HttpModule],
      declarations: [ AnalizaGraficznaComponent,
        jqxSplitterComponent,
        jqxDropDownButtonComponent,
        jqxTreeComponent,
        jqxWindowComponent,
        jqxGridComponent,
        jqxColorPickerComponent,
        jqxButtonComponent,
    
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
    fixture = TestBed.createComponent(AnalizaGraficznaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
