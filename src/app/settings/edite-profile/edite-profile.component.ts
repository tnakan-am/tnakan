import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { IUser, Type } from '../../shared/interfaces/user.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-edite-profile',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    TranslateModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogClose,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
  ],
  templateUrl: './edite-profile.component.html',
  styleUrl: './edite-profile.component.scss',
})
export class EditeProfileComponent implements OnInit {
  protected readonly Type = Type;
  readonly dialogRef = inject(MatDialogRef<EditeProfileComponent>);
  readonly data = inject<IUser>(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  form!: FormGroup;
  type!: Type;

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data) {
      this.type = this.data.type!;
      this.form = this.fb.group({
        email: ['', Validators.email],
        [this.data.type === Type.BUSINESS ? 'company' : 'name']: ['', Validators.required],
        [this.data.type === Type.BUSINESS ? 'hvhh' : 'surname']: [''],
      });

      this.form.patchValue({
        ...this.data,
      });
    }
  }

  save() {
    return {
      ...this.form.value,
      displayName: this.form.getRawValue().name,
    };
  }
}
