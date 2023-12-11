import { TestBed } from '@angular/core/testing';

import { HttpItemCodeService } from './http-item-code.service';

describe('HttpItemCodeService', () => {
  let service: HttpItemCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpItemCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
