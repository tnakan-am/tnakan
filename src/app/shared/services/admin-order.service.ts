import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import groupBy from 'lodash-es/groupBy';

import { environment } from '../../../environments/environment';
import { Order, OrderItem } from '../interfaces/order.interface';

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private http = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/orders/admin`;

  async getBusinessOrders(startDate: Date, endDate: Date): Promise<{ [key: string]: OrderItem[] }> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    const orders = await firstValueFrom(this.http.get<Order[]>(this.base, { params }));

    const data: { [key: string]: OrderItem[] } = {};
    orders.forEach((order) => {
      const products = (order.products ?? []).map((p) => ({ ...p, orderId: order.id }));
      const grouped = groupBy(products, 'userId');
      Object.keys(grouped).forEach((key) => {
        if (data[key]) {
          data[key].push(...grouped[key]);
        } else {
          data[key] = grouped[key];
        }
      });
    });

    return data;
  }
}
