/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpKtcAddressService } from './http-ktc-address.service';

describe('Service: HttpKtcAddress', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpKtcAddressService]
    });
  });

  it('should ...', inject([HttpKtcAddressService], (service: HttpKtcAddressService) => {
    expect(service).toBeTruthy();
  }));
});
