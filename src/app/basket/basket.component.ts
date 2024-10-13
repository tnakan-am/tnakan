import { Component, WritableSignal } from '@angular/core';
import { BasketService, Order } from '../services/basket.service';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
  ],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent {
  orders!: WritableSignal<Order[]>;
  total!: number;

  constructor(private basketService: BasketService) {
    this.orders = this.basketService.basket;
    this.calculateTotal();
  }

  removeItem(product: Order) {
    this.orders.update((value) => value.filter((value1) => value1.id !== product.id));
  }

  calculateTotal() {
    this.total = this.orders().reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
