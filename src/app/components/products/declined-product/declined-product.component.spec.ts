import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinedProductComponent } from './declined-product.component';

describe('DeclinedProductComponent', () => {
  let component: DeclinedProductComponent;
  let fixture: ComponentFixture<DeclinedProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclinedProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclinedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
