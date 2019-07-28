import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyFoodComponent } from './buy-food.component';

describe('BuyFoodComponent', () => {
  let component: BuyFoodComponent;
  let fixture: ComponentFixture<BuyFoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyFoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
