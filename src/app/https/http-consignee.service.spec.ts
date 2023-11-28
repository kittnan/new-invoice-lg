import { TestBed } from '@angular/core/testing';

import { HttpConsigneeService } from './http-consignee.service';

describe('HttpConsigneeService', () => {
  let service: HttpConsigneeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpConsigneeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
