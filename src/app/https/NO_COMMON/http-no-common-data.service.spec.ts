import { TestBed } from '@angular/core/testing';

import { HttpNoCommonDataService } from './http-no-common-data.service';

describe('HttpNoCommonDataService', () => {
  let service: HttpNoCommonDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpNoCommonDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
