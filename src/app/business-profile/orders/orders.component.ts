import { Component, inject } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { forkJoin, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Notification, Order, Status } from '../../interfaces/order.interface';
import {
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { OrderItemComponent } from './order-item/order-item.component';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';

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
    MatTab,
    MatTabContent,
    MatTabGroup,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  ordersService: OrdersService = inject(OrdersService);
  orders$!: Observable<Order[]>;

  constructor() {
    this.ordersService.onValue((data: Notification[]) => {
      this.orders$ = forkJoin(
        this.ordersService.getOrdersProducts(data.map((value) => value.orderId))
      );
    }, true);
  }

  orderSeen(order: Order) {
    if (
      this.ordersService.newOrders().find((value) => value.orderId === order.orderId)?.status ===
      Status.pending
    )
      this.ordersService.changeNotificationStatus(order.orderId, Status.seen).subscribe();
  }
}
