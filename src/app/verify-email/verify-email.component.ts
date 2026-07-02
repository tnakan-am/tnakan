import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { formErrorMessage } from '../shared/helpers/form-error-message';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatError,
    MatButton,
    MatProgressSpinner,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  state = signal<'verifying' | 'success' | 'error'>('verifying');
  resent = signal(false);
  loader = false;

  resendForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.state.set('error');
      return;
    }
    this.authService.verifyEmail(token).subscribe({
      next: () => this.state.set('success'),
      error: () => this.state.set('error'),
    });
  }

  resend() {
    if (this.resendForm.invalid || this.loader) {
      return;
    }
    this.loader = true;
    this.authService.resendVerification(this.resendForm.getRawValue().email).subscribe({
      next: () => {
        this.loader = false;
        this.resent.set(true);
      },
      error: () => (this.loader = false),
    });
  }

  protected readonly formErrorMessage = formErrorMessage;
}
