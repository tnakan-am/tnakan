import { Component, OnInit, signal } from '@angular/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  emailErrorMessage = signal('');
  passErrorMessage = signal('');
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  constructor(private fb: FormBuilder, private firebaseAuth: FirebaseAuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    merge(this.email!.statusChanges, this.email!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
    merge(this.password!.statusChanges, this.password!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email!.hasError('required')) {
      this.emailErrorMessage.set('required');
    } else if (this.email!.hasError('email')) {
      this.emailErrorMessage.set('email');
    } else {
      this.emailErrorMessage.set('');
    }

    if (this.password!.hasError('required')) {
      this.passErrorMessage.set('required');
    } else if (this.password!.hasError('minlength')) {
      this.passErrorMessage.set('password');
    } else {
      this.passErrorMessage.set('');
    }
  }

  login() {
    if (this.form.invalid) {
      return;
    }
    this.firebaseAuth.login(this.form.getRawValue().email, this.form.getRawValue().password);
  }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      console.log(this.firebaseAuth.getFirebaseUser());
    }
  }
}
