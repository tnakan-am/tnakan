import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterCellDef,
  MatFooterRow,
  MatFooterRowDef,
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
import { forkJoin, map, Subject, tap } from 'rxjs';
import { Product } from '../../shared/interfaces/product.interface';
import { MatDialog } from '@angular/material/dialog';
import { AdminOrderService } from '../../shared/services/admin-order.service';
import { OrderItem } from '../../shared/interfaces/order.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { flatten } from 'lodash-es';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { IUser } from '../../shared/interfaces/user.interface';
import { getMonthYearArray } from '../../shared/helpers/get-month-year';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
const currentMonth = (date?: string) => {
  // Create a new Date instance for today's date
  const today = date ? new Date(+date.split('-')[1], +date.split('-')[0]) : new Date();

  // Get the first day of the current month
  const monthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  // Get the last day of the current month
  const monthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
  return { monthStart, monthEnd };
};

@Component({
  selector: 'app-admin-orders',
  imports: [
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
    MatFormField,
    MatSelect,
    MatOption,
    FormsModule,
    MatLabel,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatFooterCellDef,
    MatProgressSpinner,
    CurrencyPipe,
  ],
  standalone: true,
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss',
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  orders: WritableSignal<OrderItem[] | undefined> = signal([]);
  ordersData!: { [key: string]: OrderItem[] };
  displayedColumns: string[] = ['ID', 'name', 'description', 'unit', 'price', 'paidAt', 'star'];
  users: WritableSignal<IUser[]> = signal([]);
  months: string[] = getMonthYearArray();
  public userIds: string[] = [];
  private unsubscribe: Subject<void> = new Subject<void>();
  selectedUser!: string;
  selectedMonth: string;
  totalCost = computed(() =>
    this.orders()?.reduce((acc, cur) => acc + +cur.price * +cur.quantity, 0)
  );
  loading = true;

  constructor(private orderService: AdminOrderService, private usersService: UsersService) {
    this.selectedMonth = this.months[0];
    this.getOrders(this.months[0]);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  openDialog(form?: Product): void {}

  userChanged($event: any) {
    this.orders.update((orders) => this.ordersData[$event.value]);
  }

  getOrders(date?: string) {
    this.loading = true;
    const { monthStart, monthEnd } = currentMonth(date);
    fromPromise(this.orderService.getBusinessOrders(monthStart, monthEnd))
      .pipe(
        tap((value) => {
          this.ordersData = value;
          this.userIds = Object.keys(value);
          forkJoin(this.userIds.map((id) => this.usersService.getUserById(id))).subscribe({
            next: (value) => {
              this.users.update((users) => (users ? value : value));
            },
          });
        }),
        map((value) => flatten([...Object.values(value)]) as OrderItem[])
      )
      .subscribe({
        next: (value) => {
          this.orders.update((orders) => {
            this.loading = false;
            return value;
          });
        },
        error: (error) => {
          this.loading = false;
          console.error(error);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
