import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RegistrationComponent } from './registration.component';
import { AuthService } from '../shared/services/auth.service';
import { IUser, Type } from '../shared/interfaces/user.interface';

describe('RegistrationComponent', () => {
  const form = { email: 'a@test.am', password: 'secret123', type: Type.CUSTOMER } as IUser;

  function create(token?: string) {
    const authService = jasmine.createSpyObj<AuthService>('AuthService', ['signUp']);
    authService.signUp.and.returnValue(of({ success: true, data: form, message: '' }));
    const params = token ? { token } : {};
    TestBed.configureTestingModule({
      imports: [RegistrationComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: { snapshot: { params }, params: of(params) } },
      ],
    }).overrideComponent(RegistrationComponent, { set: { imports: [], template: '' } });
    const fixture = TestBed.createComponent(RegistrationComponent);
    fixture.detectChanges();
    return { component: fixture.componentInstance, authService };
  }

  it('sends the invite token on the admin invite link', () => {
    const { component, authService } = create('invite-123');

    component.fireAuthentication(form);

    expect(authService.signUp).toHaveBeenCalledWith({ ...form, inviteToken: 'invite-123' });
  });

  it('sends the form as is without a token', () => {
    const { component, authService } = create();

    component.fireAuthentication(form);

    expect(authService.signUp).toHaveBeenCalledWith(form);
  });
});
