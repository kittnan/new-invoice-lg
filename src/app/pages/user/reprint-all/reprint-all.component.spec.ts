import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprintAllComponent } from './reprint-all.component';

describe('ReprintAllComponent', () => {
  let component: ReprintAllComponent;
  let fixture: ComponentFixture<ReprintAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprintAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReprintAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
