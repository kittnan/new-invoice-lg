import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPackingNoComComponent } from './viewer-packing-no-com.component';

describe('ViewerPackingNoComComponent', () => {
  let component: ViewerPackingNoComComponent;
  let fixture: ComponentFixture<ViewerPackingNoComComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerPackingNoComComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerPackingNoComComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
