import { TestBed } from '@angular/core/testing';

import { HttpNoCommonDataFormService } from './http-no-common-data-form.service';

describe('HttpNoCommonDataFormService', () => {
  let service: HttpNoCommonDataFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpNoCommonDataFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
