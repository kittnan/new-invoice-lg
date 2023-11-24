import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccounteeComponent } from './accountee.component';

describe('AccounteeComponent', () => {
  let component: AccounteeComponent;
  let fixture: ComponentFixture<AccounteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccounteeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccounteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
