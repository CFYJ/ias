import { TestBed, inject } from '@angular/core/testing';

import { UpowaznieniaService } from './upowaznienia.service';

import { SimpleGlobal } from 'ng2-simple-global';
import { HttpModule } from '@angular/http';

describe('UpowaznieniaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        // FormsModule, 
        // RouterTestingModule, 
        HttpModule],
      providers: [UpowaznieniaService,
        SimpleGlobal,
      ]
    });
  });

  it('should be created', inject([UpowaznieniaService], (service: UpowaznieniaService) => {
    expect(service).toBeTruthy();
  }));
});
