import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';

import { AuthenticationService } from './../authentication.service';
import { RouterTestingModule} from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { SimpleGlobal } from 'ng2-simple-global';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent,
        jqxWindowComponent,
       ],
       providers:[
        AuthenticationService,
        JwtHelper,
        SimpleGlobal
       ],
       imports: [ 
        //  FormsModule, 
        
        RouterTestingModule, 
        HttpModule      
       ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
