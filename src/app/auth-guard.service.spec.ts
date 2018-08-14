import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { AuthenticationService } from './authentication.service';

import { RouterTestingModule} from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { SimpleGlobal } from 'ng2-simple-global';

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule,
        HttpModule
      ],
      providers: [AuthGuardService,
        AuthenticationService,
        JwtHelper,
        SimpleGlobal,
      ]
    });
  });

  it('should be created', inject([AuthGuardService], (service: AuthGuardService) => {
    expect(service).toBeTruthy();
  }));
});
