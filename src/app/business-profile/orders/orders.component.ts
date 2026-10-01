import { Component, computed, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NotificationsService } from '../../shared/services/notifications.service';
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
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  imports: [
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
    MatProgressSpinner,
    TranslateModule,
  ],
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  ordersService: NotificationsService = inject(NotificationsService);
  orderService: OrderService = inject(OrderService);
  orders: WritableSignal<Order[]> = signal([]);
  newOrders = computed(() => this.ordersService.newOrders());
  loading: boolean = true;

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
    this.loading = true;
    this.orderService.getBusinessOrders().subscribe({
      next: (orders) => {
        this.orders.update(() => orders);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  // The API returns only this vendor's lines, which move through statuses together.
  statusOf(order: Order): Status {
    return order.products[0]?.status ?? Status.pending;
  }

  orderSeen(order: Order) {
    if (
      this.newOrders().find((value) => value.orderId === order.orderId)?.status ===
        Status.pending ||
      this.statusOf(order) === Status.pending
    ) {
      this.ordersService.changeNotificationStatus(order, Status.seen).subscribe({
        next: () => this.setStatus(order, Status.seen),
      });
    }
  }

  orderStatusChange(order: Order) {
    const nextStatus = this.orderStatus.get(this.statusOf(order));
    if (!nextStatus) return;
    fromPromise(this.ordersService.changeProductsStatus(order, nextStatus)).subscribe({
      next: () => this.setStatus(order, nextStatus),
    });
  }

  private setStatus(order: Order, status: Status) {
    this.orders.update((orders) =>
      orders.map((value) =>
        value.orderId === order.orderId
          ? { ...value, products: value.products.map((product) => ({ ...product, status })) }
          : value
      )
    );
  }
}
