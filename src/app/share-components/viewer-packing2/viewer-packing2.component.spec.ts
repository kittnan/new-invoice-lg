import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPacking2Component } from './viewer-packing2.component';

describe('ViewerPacking2Component', () => {
  let component: ViewerPacking2Component;
  let fixture: ComponentFixture<ViewerPacking2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerPacking2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerPacking2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
