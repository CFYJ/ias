import { TestBed, inject } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { RouterTestingModule} from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { SimpleGlobal } from 'ng2-simple-global';

describe('AuthenticationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule,
        HttpModule
      ],
      providers: [
        AuthenticationService,
        JwtHelper,
        SimpleGlobal,
      ]
    });
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
