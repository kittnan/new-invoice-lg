import { TestBed } from '@angular/core/testing';

import { GenerateInvoicePdfService } from './generate-invoice-pdf.service';

describe('GenerateInvoicePdfService', () => {
  let service: GenerateInvoicePdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateInvoicePdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
