import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPackingComponent } from './config-packing.component';

describe('ConfigPackingComponent', () => {
  let component: ConfigPackingComponent;
  let fixture: ComponentFixture<ConfigPackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigPackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
