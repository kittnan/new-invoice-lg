import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigInvoiceComponent } from './config-invoice.component';

describe('ConfigInvoiceComponent', () => {
  let component: ConfigInvoiceComponent;
  let fixture: ComponentFixture<ConfigInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
