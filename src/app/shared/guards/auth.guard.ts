import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.get();
  const exp = token ? getTokenExp(token) : null;

  if (exp !== null && exp * 1000 > Date.now()) {
    return true;
  }

  tokenService.clear();
  return router.createUrlTree(['/login']);
};

function getTokenExp(token: string): number | null {
  const segment = token.split('.')[1];
  if (!segment) return null;
  try {
    const json = atob(segment.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json);
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}
