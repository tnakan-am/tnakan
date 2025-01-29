import { merge } from 'rxjs';
import { FormGroup } from '@angular/forms';

export const passwordsMatching = (form: FormGroup) => {
  const passControl = form.get('password')!;
  const repassControl = form.get('rePassword')!;
  merge(passControl.valueChanges, repassControl.valueChanges).subscribe({
    next: () => {
      if (form.get('password')!.value !== form.get('rePassword')!.value) {
        repassControl.setErrors({ match: true });
      }
    },
  });
};
