import { TestBed } from '@angular/core/testing';

import { PrescriptionInfoService } from './prescription-info.service';

describe('PrescriptionInfoService', () => {
  let service: PrescriptionInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrescriptionInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
