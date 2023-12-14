import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerInvoiceComponent } from './viewer-invoice.component';

describe('ViewerInvoiceComponent', () => {
  let component: ViewerInvoiceComponent;
  let fixture: ComponentFixture<ViewerInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
