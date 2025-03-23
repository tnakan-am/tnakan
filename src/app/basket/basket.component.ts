import { Component, inject, OnInit, Signal, WritableSignal } from '@angular/core';
import { BasketService } from '../shared/services/basket.service';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { MatOption, MatSelect } from '@angular/material/select';
import { OrderItem, Status } from '../shared/interfaces/order.interface';
import { NotificationsService } from '../shared/services/notifications.service';
import { openSnackBar } from '../shared/helpers/snackbar';
import { Availability } from '../shared/interfaces/product.interface';
import { formErrorMessage } from '../shared/helpers/form-error-message';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderService } from '../shared/services/order.service';
import { UsersService } from '../shared/services/users.service';
import { filter, map, take } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-basket',
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatIconButton,
    MatIcon,
    ReactiveFormsModule,
    MatStepper,
    MatStep,
    MatStepperNext,
    MatButton,
    MatStepperPrevious,
    MatSelect,
    MatOption,
    MatStepLabel,
    MatError,
    TranslateModule,
    MatCardHeader,
    CurrencyPipe,
  ],
  standalone: true,
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent implements OnInit {
  protected readonly formErrorMessage = formErrorMessage;
  protected readonly snackBar = openSnackBar();
  products!: WritableSignal<OrderItem[]>;
  regions!: Signal<string[]>;
  cities!: WritableSignal<{ city: string; admin_name: string }[]>;
  total!: number;
  orderForm!: FormGroup;
  citiesList!: { city: string; admin_name: string }[];
  translate = inject(TranslateService);
  amd = 'AMD';

  constructor(
    private basketService: BasketService,
    private fb: FormBuilder,
    private ordersService: NotificationsService,
    private orderService: OrderService,
    private usersService: UsersService
  ) {
    this.products = this.basketService.basket;
    this.cities = basketService.cities;
    this.regions = basketService.regions;

    this.orderForm = this.fb.group({
      products: this.fb.array(
        this.products().map((value) =>
          fb.group({
            ...value,
            comment: [],
            quantity: [
              value.minQuantity,
              [
                Validators.required,
                Validators.min(value.minQuantity),
                Validators.max(
                  value.availability === Availability.unlimited ? 1000000000 : value.availability
                ),
              ],
            ],
            status: Status.pending,
          })
        ),
        Validators.required
      ),
      address: this.fb.group({
        city: ['', Validators.required],
        region: ['', Validators.required],
        street: ['', Validators.required],
        house: ['', Validators.required],
        zip: [''],
      }),
    });

    this.calculateTotal();
  }

  ngOnInit() {
    this.usersService
      .getUserData()
      .pipe(
        take(1),
        filter((value) => !!value?.address?.street),
        map((value) => value?.address)
      )
      .subscribe({
        next: (value) => {
          this.orderForm.patchValue({ address: value });
          this.regionChange(value!.region);
        },
      });
  }

  removeItem(product: OrderItem) {
    this.products.update((value) => value.filter((value1) => value1.id !== product.id));
  }

  calculateTotal() {
    this.total = this.orderForm
      ?.getRawValue()
      .products.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
  }

  regionChange($event: string) {
    this.citiesList = this.cities().filter((value1) => value1.admin_name === $event);
  }

  placeOrder() {
    if (!this.orderForm.valid) {
      return;
    }
    this.orderService
      .addOrder({
        ...this.orderForm.value,
        total: this.total,
        status: Status.pending,
      })
      .subscribe({
        next: () => {
          this.translate.get('messages.orderPlaced').subscribe({
            next: (value) => {
              this.snackBar(value);
            },
          });
          this.products.set([]);
        },
        error: (err) => {
          this.snackBar(err.message);
        },
        complete: () => {
          this.products.set([]);
        },
      });
  }
}
