import { TestBed } from '@angular/core/testing';

import { ConvertXLSXService } from './convert-xlsx.service';

describe('ConvertXLSXService', () => {
  let service: ConvertXLSXService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertXLSXService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
