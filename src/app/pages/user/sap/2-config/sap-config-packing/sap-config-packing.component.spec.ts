import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapConfigPackingComponent } from './sap-config-packing.component';

describe('SapConfigPackingComponent', () => {
  let component: SapConfigPackingComponent;
  let fixture: ComponentFixture<SapConfigPackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SapConfigPackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SapConfigPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
