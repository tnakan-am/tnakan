import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOption, MatSelect } from '@angular/material/select';
import { CategoryTree, ProductCategory, Sub } from '../../../interfaces/categories.interface';
import { MatIcon } from '@angular/material/icon';
import { UnitTypeEnum } from '../../../product/common/enums/unit.enum';
import { Product } from '../../../interfaces/product.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ProductsService } from '../../../services/products.service';
import { SelectItem } from '../../../interfaces/select-item.interface';
import { DeliveryOption } from '../../../constants/delivery-option.enum';

export interface DialogData {
  name: string;
  categories: Array<CategoryTree>;
  form?: Product;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatIcon,
    TranslateModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddProductComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly productsService = inject(ProductsService);
  units!: Array<SelectItem>;
  options!: Array<SelectItem>;
  form!: FormGroup;
  subCategories!: Array<Sub> | undefined;
  productCategories!: Array<ProductCategory> | undefined;

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.maxLength(250)]],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      productCategory: [],
      image: ['', Validators.required],
      avgReview: [0],
      unit: ['quantity'],
      deliveryOption: ['nearest'],
      price: ['', Validators.required],
    });
    this.units = [];
    this.options = [];
    Object.keys(UnitTypeEnum).forEach((key) => {
      this.units.push({ id: key, name: UnitTypeEnum[key as keyof typeof UnitTypeEnum] });
    });
    Object.keys(DeliveryOption).forEach((key) => {
      this.options.push({ id: key, name: DeliveryOption[key as keyof typeof DeliveryOption] });
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.checks();
    }, 500);
  }

  private checks() {
    if (this.data.form) {
      if (this.data.form.category) {
        this.subCategories = this.data.categories.find(
          (value) => value.id === this.data.form?.category
        )?.sub;
      }
      if (this.data.form.subCategory) {
        this.productCategories = this.subCategories?.find(
          (value) => value.id === this.data.form?.subCategory
        )?.productCategories;
      }
      this.form.patchValue(this.data.form, { onlySelf: true, emitEvent: true });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.dialogRef.close(this.form.getRawValue());
  }

  categoryChanged($event: any) {
    this.subCategories = this.data.categories.find((value) => value.id === $event)?.sub;
    this.form.get('subCategory')?.setValue(null);
    this.form.get('productCategory')?.setValue(null);
  }

  subCategoryChanged($event: string) {
    this.productCategories = this.subCategories?.find(
      (value) => value.id === $event
    )?.productCategories;
    this.form.get('productCategory')?.setValue(null);
  }

  uploadFile(event: any) {
    const file = event?.target?.files?.[0];
    if (!file) return;
    this.productsService.uploadFile(file).subscribe({
      next: (value) => {
        this.form.patchValue({ image: value });
      },
    });
  }
}
