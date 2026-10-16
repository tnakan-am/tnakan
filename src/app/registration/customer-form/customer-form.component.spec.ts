import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { CustomerFormComponent } from './customer-form.component';

describe('CustomerFormComponent', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFormComponent],
      providers: [provideTranslateService(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('prefills and locks the invited email', () => {
    const invited = TestBed.createComponent(CustomerFormComponent);
    invited.componentRef.setInput('inviteEmail', 'new@admin.am');
    invited.detectChanges();

    const email = invited.componentInstance.form.controls['email'];
    expect(email.value).toBe('new@admin.am');
    expect(email.disabled).toBeTrue();
  });
});
