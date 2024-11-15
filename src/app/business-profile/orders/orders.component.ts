import { Component, effect, inject, OnInit } from '@angular/core';
import { NotificationsService } from '../../shared/services/notifications.service';
import { AsyncPipe } from '@angular/common';
import { Order, Status } from '../../shared/interfaces/order.interface';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { OrderItemComponent } from './order-item/order-item.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { OrderStatusPipe } from '../../shared/order-status.pipe';
import { OrderService } from '../../shared/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    AsyncPipe,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelContent,
    OrderItemComponent,
    MatIcon,
    MatTooltip,
    MatIconButton,
    MatAccordion,
    OrderStatusPipe,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  ordersService: NotificationsService = inject(NotificationsService);
  orderService: OrderService = inject(OrderService);
  orders!: Order[];
  newOrders = this.ordersService.newOrders;
  status!: Status;

  orderStatus: Map<Status, Status> = new Map<Status, Status>([
    [Status.pending, Status.seen],
    [Status.seen, Status.processing],
    [Status.processing, Status.delivered],
  ]);

  constructor() {
    effect(() => {
      if (this.newOrders().length) {
        this.getOrders();
      }
    });
  }

  ngOnInit() {
    this.getOrders();
  }

  private getOrders() {
    this.orderService.getBusinessOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
    });
  }

  orderSeen(order: Order) {
    this.status = order.products.map((value) => value.status)[0];
    if (
      this.newOrders().find((value) => value.orderId === order.orderId)?.status ===
        Status.pending ||
      this.status === Status.pending
    ) {
      this.ordersService.changeNotificationStatus(order, Status.seen).subscribe({
        next: () => {
          this.status = Status.seen;
          this.orders = this.orders.map((value) =>
            value.orderId === order.orderId
              ? {
                  ...value,
                  products: value.products.map((value1) => ({ ...value1, status: Status.seen })),
                }
              : value
          );
        },
      });
    }
  }

  orderStatusChange(order: Order) {
    fromPromise(
      this.ordersService.changeProductsStatus(order, this.orderStatus.get(this.status)!)
    ).subscribe({
      next: () => {
        this.status = this.orderStatus.get(this.status)!;
        this.orders.forEach((orderItem) =>
          orderItem.orderId === order.orderId
            ? {
                ...order,
                products: order.products.map((order) => ({
                  ...order,
                  status: this.orderStatus.get(this.status)!,
                })),
              }
            : orderItem
        );
      },
    });
  }
}
