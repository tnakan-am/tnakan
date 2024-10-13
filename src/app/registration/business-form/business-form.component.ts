import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { BaseFormComponent } from '../base-form.component';
import { RouterLink } from '@angular/router';
import { MatAnchor, MatButton } from '@angular/material/button';

@Component({
  selector: 'app-business-form',
  standalone: true,
  imports: [
    TranslateModule,
    MatError,
    MatInput,
    MatFormField,
    ReactiveFormsModule,
    MatIcon,
    RouterLink,
    MatAnchor,
    MatButton,
    MatLabel,
    MatSuffix,
  ],
  templateUrl: './business-form.component.html',
  styleUrl: './business-form.component.scss',
})
export class BusinessFormComponent extends BaseFormComponent {
  declare form: FormGroup;

  constructor(private fb: FormBuilder) {
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
