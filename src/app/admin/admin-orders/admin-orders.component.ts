import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { Product } from '../../shared/interfaces/product.interface';
import { MatDialog } from '@angular/material/dialog';
import { AdminOrderService } from '../../shared/services/admin-order.service';
import { Order } from '../../shared/interfaces/order.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

const currentMonth = () => {
  // Create a new Date instance for today's date
  const today = new Date();

  // Get the first day of the current month
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Get the last day of the current month
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { monthStart, monthEnd };
};

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatTable,
    TranslateModule,
    MatHeaderCellDef,
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss',
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  orders$!: Observable<Order[]>;
  displayedColumns: string[] = ['ID', 'name', 'description', 'unit', 'price', 'paidAt', 'star'];
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(private orderService: AdminOrderService) {}

  ngOnInit() {
    this.orders$ = fromPromise(
      this.orderService.getBusinessOrders(currentMonth().monthStart, currentMonth().monthEnd)
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  openDialog(form?: Product): void {}
}
