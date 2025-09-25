import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCommonPrintPackingComponent } from './no-common-print-packing.component';

describe('NoCommonPrintPackingComponent', () => {
  let component: NoCommonPrintPackingComponent;
  let fixture: ComponentFixture<NoCommonPrintPackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoCommonPrintPackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoCommonPrintPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
