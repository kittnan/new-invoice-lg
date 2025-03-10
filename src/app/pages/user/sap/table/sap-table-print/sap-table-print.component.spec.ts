import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapTablePrintComponent } from './sap-table-print.component';

describe('SapTablePrintComponent', () => {
  let component: SapTablePrintComponent;
  let fixture: ComponentFixture<SapTablePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SapTablePrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SapTablePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
