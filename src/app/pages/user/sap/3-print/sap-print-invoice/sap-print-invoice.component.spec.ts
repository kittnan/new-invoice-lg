import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapPrintInvoiceComponent } from './sap-print-invoice.component';

describe('SapPrintInvoiceComponent', () => {
  let component: SapPrintInvoiceComponent;
  let fixture: ComponentFixture<SapPrintInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SapPrintInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SapPrintInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
