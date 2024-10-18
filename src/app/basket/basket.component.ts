import { Component, OnInit, Signal, WritableSignal } from '@angular/core';
import { BasketService } from '../services/basket.service';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
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
import { OrderItem, Status } from '../interfaces/order.interface';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
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
  ],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent implements OnInit {
  orders!: WritableSignal<OrderItem[]>;
  total!: number;
  orderForm!: FormGroup;
  regions!: Signal<string[]>;
  cities!: WritableSignal<{ city: string; admin_name: string }[]>;
  citiesList!: { city: string; admin_name: string }[];

  constructor(
    private basketService: BasketService,
    private fb: FormBuilder,
    private ordersService: OrdersService
  ) {
    this.orders = this.basketService.basket;
    this.cities = basketService.cities;
    this.regions = basketService.regions;

    this.orderForm = this.fb.group({
      products: this.fb.array(
        this.orders().map((value) =>
          fb.group({
            ...value,
            comment: [],
            quantity: [value.minQuantity, [Validators.required, Validators.min(value.minQuantity)]],
          })
        )
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

  ngOnInit() {}

  removeItem(product: OrderItem) {
    this.orders.update((value) => value.filter((value1) => value1.id !== product.id));
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
    this.ordersService.addOrder({
      ...this.orderForm.value,
      total: this.total,
      status: Status.pending,
    });
  }
}
