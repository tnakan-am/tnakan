import { merge, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';

export const passwordsMatching = (form: FormGroup): Subscription => {
  const passControl = form.get('password')!;
  const repassControl = form.get('rePassword')!;
  return merge(passControl.valueChanges, repassControl.valueChanges).subscribe({
    next: () => {
      const errors = { ...repassControl.errors };
      if (passControl.value !== repassControl.value) {
        repassControl.setErrors({ ...errors, match: true });
      } else if (errors['match']) {
        delete errors['match'];
        repassControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    },
  });
};
