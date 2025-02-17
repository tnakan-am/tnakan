import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { UsersService } from './users.service';
import { Type } from '../interfaces/user.interface';

export const permissionsGuard: (type: Type) => CanActivateFn = (type) => (route, state) => {
  const router = inject(Router);
  const users = inject(UsersService);
  const user = users.getUserData();

  return user.pipe(
    map((value) => {
      if (!value) {
        router.navigate(['/login']);
      } else if (value?.type !== type) {
        router.navigate(['/']);
      }
      return value?.type === type;
    })
  );
};
