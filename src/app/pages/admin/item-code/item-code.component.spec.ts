import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCodeComponent } from './item-code.component';

describe('ItemCodeComponent', () => {
  let component: ItemCodeComponent;
  let fixture: ComponentFixture<ItemCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
