import { TestBed, inject } from '@angular/core/testing';

import { KontaktyService } from './kontakty.service';

import { HttpModule } from '@angular/http';
import { SimpleGlobal } from 'ng2-simple-global';

describe('KontaktyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KontaktyService,
        SimpleGlobal],
      imports: [ 
        // FormsModule, 
        // RouterTestingModule, 
        HttpModule,
      ],
    });
  });

  it('should be created', inject([KontaktyService], (service: KontaktyService) => {
    expect(service).toBeTruthy();
  }));
});
