import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { formErrorMessage } from '../shared/helpers/form-error-message';
import { passwordsMatching } from '../shared/helpers/passwords-matching.const';

@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  state = signal<'form' | 'success' | 'error'>('form');
  loader = false;
  private token = '';
  private subscription?: Subscription;

  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    rePassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit() {
    this.subscription = passwordsMatching(this.form);
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.state.set('error');
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  submit() {
    if (this.form.invalid || this.loader) {
      return;
    }
    this.loader = true;
    this.authService.resetPassword(this.token, this.form.getRawValue().password).subscribe({
      next: () => {
        this.loader = false;
        this.state.set('success');
      },
      error: () => {
        this.loader = false;
        this.state.set('error');
      },
    });
  }

  protected readonly formErrorMessage = formErrorMessage;
}
