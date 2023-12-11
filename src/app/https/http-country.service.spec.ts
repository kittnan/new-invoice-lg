import { TestBed } from '@angular/core/testing';

import { HttpCountryService } from './http-country.service';

describe('HttpCountryService', () => {
  let service: HttpCountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
