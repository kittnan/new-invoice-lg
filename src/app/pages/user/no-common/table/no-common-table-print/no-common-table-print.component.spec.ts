import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCommonTablePrintComponent } from './no-common-table-print.component';

describe('NoCommonTablePrintComponent', () => {
  let component: NoCommonTablePrintComponent;
  let fixture: ComponentFixture<NoCommonTablePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoCommonTablePrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoCommonTablePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
