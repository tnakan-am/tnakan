import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsApproveComponent } from './ads-approve.component';

describe('AdsApproveComponent', () => {
  let component: AdsApproveComponent;
  let fixture: ComponentFixture<AdsApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdsApproveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdsApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
