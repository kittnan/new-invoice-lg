import { TestBed } from '@angular/core/testing';

import { HttpPktaService } from './http-pkta.service';

describe('HttpPktaService', () => {
  let service: HttpPktaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpPktaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
