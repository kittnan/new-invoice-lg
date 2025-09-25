import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCommonConfigPackingComponent } from './no-common-config-packing.component';

describe('NoCommonConfigPackingComponent', () => {
  let component: NoCommonConfigPackingComponent;
  let fixture: ComponentFixture<NoCommonConfigPackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoCommonConfigPackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoCommonConfigPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
