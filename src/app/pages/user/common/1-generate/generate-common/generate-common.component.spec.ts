import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCommonComponent } from './generate-common.component';

describe('GenerateCommonComponent', () => {
  let component: GenerateCommonComponent;
  let fixture: ComponentFixture<GenerateCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateCommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
