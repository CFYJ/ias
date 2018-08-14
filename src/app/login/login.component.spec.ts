import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

import { FormsModule } from '@angular/forms';
import { RouterTestingModule} from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { SimpleGlobal } from 'ng2-simple-global';
import { AuthenticationService } from './../authentication.service';
import { MessageService } from './../message.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent 
      ],
      imports: [ FormsModule, 
         RouterTestingModule, 
         HttpModule
      ],
      providers:[
        AuthenticationService,
        JwtHelper,
        SimpleGlobal,
        MessageService
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
