import { TestBed } from '@angular/core/testing';

import { HttpSapPackingService } from './http-sap-packing.service';

describe('HttpSapPackingService', () => {
  let service: HttpSapPackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpSapPackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
