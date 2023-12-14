import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPackingComponent } from './viewer-packing.component';

describe('ViewerPackingComponent', () => {
  let component: ViewerPackingComponent;
  let fixture: ComponentFixture<ViewerPackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerPackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
