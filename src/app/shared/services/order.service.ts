import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Order } from '../interfaces/order.interface';
import { openSnackBar } from '../helpers/snackbar';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private snackBar = openSnackBar();

  private readonly base = `${environment.apiUrl}/orders`;

  addOrder(order: Order): Observable<Order> {
    const payload = {
      address: order.address,
      userPhone: order.userPhone,
      items: order.products.map((p) => ({
        productId: p.id,
        quantity: p.quantity,
        comment: p.comment,
      })),
    };
    return this.http.post<Order>(this.base, payload);
  }

  getBusinessOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${this.base}/business`)
      .pipe(map((orders) => orders.map((o) => withOrderIdAlias(o))));
  }

  getCustomerOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${this.base}/customer`)
      .pipe(map((orders) => orders.map((o) => withOrderIdAlias(o))));
  }
}

function withOrderIdAlias(order: Order): Order {
  if (!order.orderId) order.orderId = order.id;
  if (order.products) {
    order.products = order.products.map((p) => ({ ...p, orderId: order.id }));
  }
  return order;
}
