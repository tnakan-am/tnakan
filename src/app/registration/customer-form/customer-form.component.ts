import { Component, input } from '@angular/core';
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
  inviteEmail = input('');

  constructor() {
    super();
    this.form = this.fb.group({
      ...this.commonFields,
      type: ['customer'],
      name: ['', [Validators.required]],
      surname: [''],
    });
  }

  override ngOnInit() {
    super.ngOnInit();
    // The server only redeems an invite for the address it was sent to.
    if (this.inviteEmail()) {
      const email = this.form.controls['email'];
      email.setValue(this.inviteEmail());
      email.disable();
    }
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
