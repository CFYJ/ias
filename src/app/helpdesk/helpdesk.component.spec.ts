import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskComponent } from './helpdesk.component';

import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';


import { FormsModule } from '@angular/forms';
import { AuthenticationService } from './../authentication.service';
import { MessageService } from './../message.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { RouterTestingModule} from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';

describe('HelpdeskComponent', () => {
  let component: HelpdeskComponent;
  let fixture: ComponentFixture<HelpdeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule, HttpModule],
      declarations: [ HelpdeskComponent,
        jqxGridComponent,
       ],
       providers:[
        AuthenticationService,
        JwtHelper,
        SimpleGlobal,
        MessageService
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
