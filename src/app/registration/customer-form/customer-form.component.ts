import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { BaseFormComponent } from '../base-form.component';
import { RouterLink } from '@angular/router';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    TranslateModule,
    MatError,
    MatInput,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    RouterLink,
    MatButton,
    MatAnchor,
    MatOption,
    MatSelect,
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
})
export class CustomerFormComponent extends BaseFormComponent {
  declare form: FormGroup;

  constructor() {
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
