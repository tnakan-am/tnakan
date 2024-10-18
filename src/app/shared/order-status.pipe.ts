import { Pipe, PipeTransform } from '@angular/core';
import { Notification, Order, Status } from './interfaces/order.interface';

@Pipe({
  name: 'orderStatus',
  standalone: true,
  pure: true,
})
export class OrderStatusPipe implements PipeTransform {
  transform(value: Order, ...args: Notification[][]): unknown {
    return args[0].find((val) => val.orderId === value.orderId)?.status === Status.pending;
  }
}
