import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KtcAddressComponent } from './ktc-address.component';

describe('KtcAddressComponent', () => {
  let component: KtcAddressComponent;
  let fixture: ComponentFixture<KtcAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KtcAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KtcAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
