import { TestBed } from '@angular/core/testing';

import { HttpReprintService } from './http-reprint.service';

describe('HttpReprintService', () => {
  let service: HttpReprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpReprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
