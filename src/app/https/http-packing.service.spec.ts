import { TestBed } from '@angular/core/testing';

import { HttpPackingService } from './http-packing.service';

describe('HttpPackingService', () => {
  let service: HttpPackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpPackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
