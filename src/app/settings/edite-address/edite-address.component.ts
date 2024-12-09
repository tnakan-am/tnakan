import { Component, inject, OnInit, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { IUser } from '../../shared/interfaces/user.interface';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Address } from '../../shared/helpers/address-form-builder.const';
import { BasketService } from '../../shared/services/basket.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-edite-address',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    TranslateModule,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatLabel,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: './edite-address.component.html',
  styleUrl: './edite-address.component.scss',
})
export class EditeAddressComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EditeAddressComponent>);
  readonly data = inject<IUser>(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  basketService = inject(BasketService);

  form: FormGroup = this.fb.group({ ...Address });
  regions!: Signal<string[]>;
  cities!: WritableSignal<{ city: string; admin_name: string }[]>;
  citiesList!: { city: string; admin_name: string }[];

  constructor() {
    this.cities = this.basketService.cities;
    this.regions = this.basketService.regions;
  }

  ngOnInit(): void {
    this.data && this.form.patchValue(this.data.address!);
  }

  regionChange($event: string) {
    this.citiesList = this.cities().filter((value1) => value1.admin_name === $event);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    return this.form.value;
  }
}
