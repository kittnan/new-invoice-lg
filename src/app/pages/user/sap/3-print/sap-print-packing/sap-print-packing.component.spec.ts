import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapPrintPackingComponent } from './sap-print-packing.component';

describe('SapPrintPackingComponent', () => {
  let component: SapPrintPackingComponent;
  let fixture: ComponentFixture<SapPrintPackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SapPrintPackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SapPrintPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
