import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsigneeCodeComponent } from './consignee-code.component';

describe('ConsigneeCodeComponent', () => {
  let component: ConsigneeCodeComponent;
  let fixture: ComponentFixture<ConsigneeCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsigneeCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsigneeCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
