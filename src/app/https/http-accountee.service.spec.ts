import { TestBed } from '@angular/core/testing';

import { HttpAccounteeService } from './http-accountee.service';

describe('HttpAccounteeService', () => {
  let service: HttpAccounteeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpAccounteeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
