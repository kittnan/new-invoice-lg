import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapSearchInvoiceComponent } from './sap-search-invoice.component';

describe('SapSearchInvoiceComponent', () => {
  let component: SapSearchInvoiceComponent;
  let fixture: ComponentFixture<SapSearchInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SapSearchInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SapSearchInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
