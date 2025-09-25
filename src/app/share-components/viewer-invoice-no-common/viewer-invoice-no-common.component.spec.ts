import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerInvoiceNoCommonComponent } from './viewer-invoice-no-common.component';

describe('ViewerInvoiceNoCommonComponent', () => {
  let component: ViewerInvoiceNoCommonComponent;
  let fixture: ComponentFixture<ViewerInvoiceNoCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerInvoiceNoCommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerInvoiceNoCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
