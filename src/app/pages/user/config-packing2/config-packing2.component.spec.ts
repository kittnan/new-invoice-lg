import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPacking2Component } from './config-packing2.component';

describe('ConfigPacking2Component', () => {
  let component: ConfigPacking2Component;
  let fixture: ComponentFixture<ConfigPacking2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigPacking2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigPacking2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
