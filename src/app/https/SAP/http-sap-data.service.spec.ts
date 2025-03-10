import { TestBed } from '@angular/core/testing';

import { HttpSapDataService } from './http-sap-data.service';

describe('HttpSapDataService', () => {
  let service: HttpSapDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpSapDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
