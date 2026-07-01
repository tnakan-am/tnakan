import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TokenService } from '../services/token.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const isApiCall = req.url.startsWith(environment.apiUrl);
  const token = tokenService.get();

  const handled =
    isApiCall && token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(handled).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isApiCall) {
        if (error.status === 401 && token) {
          tokenService.clear();
          router.navigate(['/login']);
        }
        if (error.status !== 401 || token) {
          const message = extractMessage(error);
          if (message) {
            snackBar.open(message, undefined, {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        }
      }
      return throwError(() => error);
    })
  );
};

function extractMessage(error: HttpErrorResponse): string | null {
  const body = error.error;
  if (!body) return error.message || null;
  if (typeof body === 'string') return body;
  if (Array.isArray(body.message)) return body.message.join(', ');
  if (typeof body.message === 'string') return body.message;
  return error.message || null;
}
