import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprintPackingComponent } from './reprint-packing.component';

describe('ReprintPackingComponent', () => {
  let component: ReprintPackingComponent;
  let fixture: ComponentFixture<ReprintPackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprintPackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReprintPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
