import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, forkJoin, Observable, of, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Order, Status } from '../interfaces/order.interface';
import { NotificationsSocketService } from './notifications-socket.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private socketService = inject(NotificationsSocketService);
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  get newOrders() {
    return this.socketService.newOrders;
  }

  changeNotificationStatus(order: Order, status: Status): Observable<unknown> {
    const orderId = order.id ?? order.orderId;
    if (!orderId) return of(null);
    const userId = this.auth.currentUser()?.id;
    const notification = this.socketService
      .notifications()
      .find((n) => n.orderId === orderId && n.userId === userId);
    if (!notification) {
      return this.changeProductsStatus$(order, status);
    }
    return this.http
      .patch(`${environment.apiUrl}/notifications/${notification.id}/status`, { status })
      .pipe(switchMap(() => this.changeProductsStatus$(order, status)));
  }

  changeProductsStatus(order: Order, status: Status): Promise<unknown> {
    return firstValueFrom(this.changeProductsStatus$(order, status));
  }

  private changeProductsStatus$(order: Order, status: Status): Observable<unknown> {
    const orderId = order.id ?? order.orderId;
    if (!orderId) return of(null);
    const userId = this.auth.currentUser()?.id;
    const products = order.products.filter((p) => p.vendorId === userId);
    if (!products.length) return of(null);
    return forkJoin(
      products.map((p) =>
        this.http.patch(`${environment.apiUrl}/orders/${orderId}/products/${p.productId}/status`, {
          status,
        })
      )
    );
  }
}
