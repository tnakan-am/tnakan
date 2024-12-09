import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormComponent } from '../base-form.component';
import { RouterLink } from '@angular/router';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-business-form',
  standalone: true,
  imports: [
    TranslateModule,
    MatError,
    MatInput,
    MatFormField,
    ReactiveFormsModule,
    RouterLink,
    MatAnchor,
    MatButton,
    MatLabel,
    MatOption,
    MatSelect,
  ],
  templateUrl: './business-form.component.html',
  styleUrl: './business-form.component.scss',
})
export class BusinessFormComponent extends BaseFormComponent {
  declare form: FormGroup;

  constructor() {
    super();

    this.form = this.fb.group({
      ...this.commonFields,
      type: ['business'],
      company: ['', [Validators.required]],
      hvhh: [''],
    });
  }

  formSubmit() {
    if (this.form.invalid) {
      this.form.updateValueAndValidity();
      return;
    }

    const userData = {
      ...this.form.getRawValue(),
      displayName: this.form.getRawValue().company,
    };
    this.onFormSubmit.emit(userData);
  }
}
