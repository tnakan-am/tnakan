import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { formErrorMessage } from '../shared/helpers/form-error-message';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatError,
    MatButton,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  sent = signal(false);
  loader = false;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit() {
    if (this.form.invalid || this.loader) {
      return;
    }
    this.loader = true;
    this.authService.forgotPassword(this.form.getRawValue().email).subscribe({
      next: () => {
        this.loader = false;
        this.sent.set(true);
      },
      error: () => (this.loader = false),
    });
  }

  protected readonly formErrorMessage = formErrorMessage;
}
