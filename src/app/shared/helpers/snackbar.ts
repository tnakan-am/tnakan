import { inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

export const openSnackBar = () => {
  const _snackBar = inject(MatSnackBar);
  const horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  const verticalPosition: MatSnackBarVerticalPosition = 'top';
  return (message: string) => {
    return _snackBar.open(message, undefined, {
      horizontalPosition,
      verticalPosition,
      duration: 3000,
    });
  };
};
