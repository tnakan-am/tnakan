import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderItem } from '../../shared/interfaces/order.interface';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
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
import { ReviewService } from '../../shared/services/review.service';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
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
  orders$?: Observable<Order[]>;
  reviewService = inject(ReviewService);

  constructor(private orderService: OrderService) {
    this.orders$ = this.orderService.getCustomerOrders();
  }

  orderSeen(order: Order) {
    return false;
  }

  rateProduct(product: OrderItem, $event: { comment: string; stars: number }) {
    this.reviewService.writeReview(product, $event).subscribe();
  }
}
