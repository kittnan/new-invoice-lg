/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpConsigneeCodeService } from './http-consignee-code.service';

describe('Service: HttpConsigneeCode', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpConsigneeCodeService]
    });
  });

  it('should ...', inject([HttpConsigneeCodeService], (service: HttpConsigneeCodeService) => {
    expect(service).toBeTruthy();
  }));
});
