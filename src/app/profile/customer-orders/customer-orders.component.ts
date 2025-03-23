import { Component } from '@angular/core';
import { Order } from '../../shared/interfaces/order.interface';
import { DatePipe } from '@angular/common';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { OrderItemComponent } from './order-item/order-item.component';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelContent,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    OrderItemComponent,
    MatExpansionPanelHeader,
    DatePipe,
  ],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.scss',
})
export class CustomerOrdersComponent {
  orders?: Order[];

  constructor(private orderService: OrderService) {
    this.getOrders();
  }

  orderSeen(order: Order) {
    return false;
  }

  getOrders() {
    this.orderService.getCustomerOrders().subscribe({
      next: (value) => {
        this.orders = value;
      },
    });
  }
}
