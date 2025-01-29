import { Component, inject, OnInit } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { formErrorMessage } from '../../shared/helpers/form-error-message';
import { passwordsMatching } from '../../shared/helpers/passwords-matching.const';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [
    MatDialogContent,
    MatButton,
    MatDialogActions,
    TranslateModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatDialogClose,
    MatDialogTitle,
    MatError,
  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
})
export class UpdatePasswordComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<UpdatePasswordComponent>);
  fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    rePassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    passwordsMatching(this.form);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    return this.form.value;
  }

  protected readonly formErrorMessage = formErrorMessage;
}
