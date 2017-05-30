import { TestBed, inject } from '@angular/core/testing';

import { KontaktyService } from './kontakty.service';

describe('KontaktyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KontaktyService]
    });
  });

  it('should be created', inject([KontaktyService], (service: KontaktyService) => {
    expect(service).toBeTruthy();
  }));
});
