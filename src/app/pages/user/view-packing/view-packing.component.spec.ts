import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPackingComponent } from './view-packing.component';

describe('ViewPackingComponent', () => {
  let component: ViewPackingComponent;
  let fixture: ComponentFixture<ViewPackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
