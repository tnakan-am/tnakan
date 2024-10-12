import { AbstractControl } from '@angular/forms';

export const formErrorMessage = (control: AbstractControl): string => {
  const errorKey = Object.keys(control.errors || {})?.[0];
  return errorKey ? `messages.errors.${errorKey}` : '';
};
