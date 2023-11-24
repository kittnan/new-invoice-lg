import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubHeadComponent } from './sub-head.component';

describe('SubHeadComponent', () => {
  let component: SubHeadComponent;
  let fixture: ComponentFixture<SubHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
