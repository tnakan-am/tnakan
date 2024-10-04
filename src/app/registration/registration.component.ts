import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { merge, Subscription } from 'rxjs';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { IUser } from '../interfaces/user.interface';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    MatTab,
    MatTabContent,
    MatTabGroup,
    MatAnchor,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit, OnDestroy {
  form: FormGroup;
  businessForm: FormGroup;
  private subscription!: Subscription;
  private commonFields = {
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rePassword: ['', [Validators.required, Validators.minLength(6)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+374(10|[3-9]\d)\d{6}$/)]],
    // region: [''],
    // city: ['yerevan', [Validators.required]],
    // street: ['', [Validators.required]],
    // block: ['', [Validators.required]],
    // apt: [''],
  };

  constructor(private fb: FormBuilder, private fireAuthService: FirebaseAuthService) {
    this.form = this.fb.group({
      ...this.commonFields,
      type: ['customer'],
      name: ['', [Validators.required]],
      surname: [''],
    });
    this.businessForm = this.fb.group({
      ...this.commonFields,
      type: ['business'],
      company: ['', [Validators.required]],
      hvhh: [''],
    });
  }

  ngOnInit() {
    this.passwordsMatching();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  errorMessage(control: AbstractControl): string {
    const errorKey = Object.keys(control.errors || {})?.[0];
    return errorKey ? `messages.errors.${errorKey}` : '';
  }

  private passwordsMatching() {
    const passControl = this.form.get('password')!;
    const repassControl = this.form.get('rePassword')!;
    this.subscription = merge(passControl.valueChanges, repassControl.valueChanges).subscribe({
      next: () => {
        if (this.form.get('password')!.value !== this.form.get('rePassword')!.value) {
          repassControl.setErrors({ match: true });
        }
      },
    });
  }

  formSubmit() {
    if (this.form.invalid) {
      this.form.updateValueAndValidity();
      return;
    }
    const userData = {
      ...this.form.getRawValue(),
      displayName: this.form.getRawValue().name,
    };
    this.fireAuthentication(userData);
  }

  businessFormSubmit() {
    if (this.businessForm.invalid) {
      this.businessForm.updateValueAndValidity();
      return;
    }

    const userData = {
      ...this.businessForm.getRawValue(),
      displayName: this.businessForm.getRawValue().company,
    };
    this.fireAuthentication(userData);
  }

  private fireAuthentication(formValue: IUser) {
    const { email, password } = formValue;
    if (!email || !password) {
      return;
    }
    this.fireAuthService.signUp(formValue);
  }
}
