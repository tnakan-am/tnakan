import {
  Component,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  runInInjectionContext,
  signal,
  Signal,
} from '@angular/core';
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
import { toSignal } from '@angular/core/rxjs-interop';

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
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss',
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  orders: Signal<OrderItem[] | undefined> = signal([]);
  ordersData!: { [key: string]: OrderItem[] };
  displayedColumns: string[] = ['ID', 'name', 'description', 'unit', 'price', 'paidAt', 'star'];
  users: Signal<IUser[] | undefined> = signal([]);
  public userIds: string[] = [];
  private unsubscribe: Subject<void> = new Subject<void>();
  selectedUser!: string;

  constructor(
    private orderService: AdminOrderService,
    private usersService: UsersService,
    private injector: Injector
  ) {
    this.orders = toSignal(
      fromPromise(
        this.orderService.getBusinessOrders(currentMonth().monthStart, currentMonth().monthEnd)
      ).pipe(
        tap((value) => {
          this.ordersData = value;
          this.userIds = Object.keys(value);
          this.users = runInInjectionContext(injector, () =>
            toSignal(forkJoin(this.userIds.map((id) => this.usersService.getUserById(id))))
          );
        }),
        map((value) => flatten([...Object.values(value)]) as OrderItem[])
      )
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  openDialog(form?: Product): void {}

  userChanged($event: any) {
    this.orders = signal(this.ordersData[$event.value]);
  }
}
