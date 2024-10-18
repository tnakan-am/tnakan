import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductsService } from '../shared/services/products.service';
import { FormGroup, Validators } from '@angular/forms';
import { merge, Subscription } from 'rxjs';
import { formErrorMessage } from '../shared/helpers/form-error-message';
import { IUser } from '../shared/interfaces/user.interface';

@Component({
  selector: 'app-bas-form',
  template: '',
  standalone: true,
})
export class BaseFormComponent implements OnInit, OnDestroy {
  @Output() onFormSubmit = new EventEmitter<IUser>();
  loader: boolean = false;
  form!: FormGroup;
  readonly productsService = inject(ProductsService);
  subscription!: Subscription;
  commonFields = {
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rePassword: ['', [Validators.required, Validators.minLength(6)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+374(10|[3-9]\d)\d{6}$/)]],
  };
  formErrorMessage = formErrorMessage;

  ngOnInit() {
    this.passwordsMatching();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
}
