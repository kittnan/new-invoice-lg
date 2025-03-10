import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapGenerateInvoiceComponent } from './sap-generate-invoice.component';

describe('SapGenerateInvoiceComponent', () => {
  let component: SapGenerateInvoiceComponent;
  let fixture: ComponentFixture<SapGenerateInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SapGenerateInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SapGenerateInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
