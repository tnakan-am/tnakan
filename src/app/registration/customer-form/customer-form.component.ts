import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { BaseFormComponent } from '../base-form.component';
import { RouterLink } from '@angular/router';
import { MatAnchor, MatButton } from '@angular/material/button';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    TranslateModule,
    MatError,
    MatInput,
    MatFormField,
    ReactiveFormsModule,
    MatIcon,
    MatLabel,
    RouterLink,
    MatButton,
    MatAnchor,
    MatSuffix,
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
})
export class CustomerFormComponent extends BaseFormComponent {
  declare form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      ...this.commonFields,
      type: ['customer'],
      name: ['', [Validators.required]],
      surname: [''],
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

    this.onFormSubmit.emit(userData);
  }
}
