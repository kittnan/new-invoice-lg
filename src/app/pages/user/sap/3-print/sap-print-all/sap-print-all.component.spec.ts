import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapPrintAllComponent } from './sap-print-all.component';

describe('SapPrintAllComponent', () => {
  let component: SapPrintAllComponent;
  let fixture: ComponentFixture<SapPrintAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SapPrintAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SapPrintAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
