import { TestBed, inject } from '@angular/core/testing';

import { UpowaznieniaService } from './upowaznienia.service';

describe('UpowaznieniaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpowaznieniaService]
    });
  });

  it('should be created', inject([UpowaznieniaService], (service: UpowaznieniaService) => {
    expect(service).toBeTruthy();
  }));
});
