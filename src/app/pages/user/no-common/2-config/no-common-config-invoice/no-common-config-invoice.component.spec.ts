import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCommonConfigInvoiceComponent } from './no-common-config-invoice.component';

describe('NoCommonConfigInvoiceComponent', () => {
  let component: NoCommonConfigInvoiceComponent;
  let fixture: ComponentFixture<NoCommonConfigInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoCommonConfigInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoCommonConfigInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
