import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, Subscription } from 'rxjs';
import { formErrorMessage } from '../shared/helpers/form-error-message';
import { IUser } from '../shared/interfaces/user.interface';
import { BasketService } from '../shared/services/basket.service';
import { Address } from '../shared/helpers/address-form-builder.const';

@Component({
  selector: 'app-bas-form',
  template: '',
  standalone: true,
})
export class BaseFormComponent implements OnInit, OnDestroy {
  formErrorMessage = formErrorMessage;
  @Output() onFormSubmit = new EventEmitter<IUser>();
  regions!: Signal<string[]>;
  cities!: WritableSignal<{ city: string; admin_name: string }[]>;
  citiesList!: { city: string; admin_name: string }[];
  form!: FormGroup;
  fb = inject(FormBuilder);
  basketService = inject(BasketService);
  subscription!: Subscription;
  commonFields = {
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rePassword: ['', [Validators.required, Validators.minLength(6)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+374(10|[3-9]\d)\d{6}$/)]],
    address: this.fb.group(Address),
  };

  constructor() {
    this.cities = this.basketService.cities;
    this.regions = this.basketService.regions;
  }

  ngOnInit() {
    this.passwordsMatching();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  regionChange($event: string) {
    this.citiesList = this.cities().filter((value1) => value1.admin_name === $event);
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
