import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCommonPrintInvoiceComponent } from './no-common-print-invoice.component';

describe('NoCommonPrintInvoiceComponent', () => {
  let component: NoCommonPrintInvoiceComponent;
  let fixture: ComponentFixture<NoCommonPrintInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoCommonPrintInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoCommonPrintInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
