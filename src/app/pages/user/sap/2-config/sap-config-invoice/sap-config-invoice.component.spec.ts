import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapConfigInvoiceComponent } from './sap-config-invoice.component';

describe('SapConfigInvoiceComponent', () => {
  let component: SapConfigInvoiceComponent;
  let fixture: ComponentFixture<SapConfigInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SapConfigInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SapConfigInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
