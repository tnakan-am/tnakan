import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsApproveComponent } from './products-approve.component';

describe('ProductsApproveComponent', () => {
  let component: ProductsApproveComponent;
  let fixture: ComponentFixture<ProductsApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsApproveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
