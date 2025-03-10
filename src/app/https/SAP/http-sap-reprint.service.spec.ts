import { TestBed } from '@angular/core/testing';

import { HttpSapReprintService } from './http-sap-reprint.service';

describe('HttpSapReprintService', () => {
  let service: HttpSapReprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpSapReprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
