import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import {
  child,
  Database,
  get,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  set,
  update,
} from '@angular/fire/database';
import { Notification, Order, OrderItem, Status } from '../interfaces/order.interface';
import { Firestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { FirebaseAuthService } from './firebase-auth.service';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { openSnackBar } from '../helpers/snackbar';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  database = inject(Database);
  firestore: Firestore = inject(Firestore);
  firebaseAuthService = inject(FirebaseAuthService);
  snackBar = openSnackBar();
  newOrders: WritableSignal<Notification[]> = signal([]);

  constructor() {}

  async addOrder(order: Order) {
    try {
      const key = push(child(ref(this.database), 'orders')).key;
      const userId = this.firebaseAuthService.getFirebaseUser()?.uid;
      const data = {
        ...order,
        userId,
        userPhone: this.firebaseAuthService.getFirebaseUser()?.phoneNumber,
        createdAt: new Date().toISOString(),
      };
      await set(ref(this.database, 'orders/' + key), data);
      data.products.forEach(async (value) => {
        await set(ref(this.database, 'notifications/' + value.userId + '/' + key), {
          orderId: key,
          createdAt: new Date().toISOString(),
          productIds: data.products
            .filter((value1) => value1.userId === userId)
            .map((value1) => value1.id),
          status: Status.pending,
        });
      });
    } catch (error) {
      this.snackBar((error as any).customData._tokenResponse.error.message);
    }
  }

  onValue(callBack: (sortedData: any) => void, onlyOnce = false) {
    const starCountRef = ref(
      this.database,
      'notifications/' + this.firebaseAuthService.getFirebaseUser()?.uid
    );

    return onValue(
      query(starCountRef, orderByChild('createdAt')),
      (snapshot) => {
        if (!snapshot.val()) return;

        const data = (Object.values(snapshot.val()) as Notification[]).sort((a: any, b: any) =>
          new Date(a.createdAt) > new Date(b.createdAt)
            ? -1
            : new Date(a.createdAt) < new Date(b.createdAt)
            ? 1
            : 0
        );
        if (!data) return;
        !onlyOnce && this.newOrders.set(data.filter((value) => value.status === Status.pending));
        callBack(data);
      },
      { onlyOnce }
    );
  }

  getOrdersProducts(orderIds: string[]): Observable<Order>[] {
    const dbRef = ref(this.database);
    const userId = this.firebaseAuthService.getFirebaseUser()?.uid;
    if (!userId) {
      return [of()];
    }

    const prms = orderIds.map((orderId) => {
      return fromPromise(
        get(child(dbRef, `orders/${orderId}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const products: OrderItem[] = data.products.filter(
                (val: any) => val.userId === userId
              );
              const total = products.reduce(
                (previousValue, currentValue) =>
                  previousValue + currentValue.price * currentValue.quantity,
                0
              );
              return {
                ...snapshot.val(),
                products,
                total,
                orderId,
              };
            } else {
              this.snackBar('No data available');
            }
          })
          .catch((error) => {
            this.snackBar((error as any).customData._tokenResponse.error.message);
          })
      );
    });

    return prms;
  }

  changeNotificationStatus(orderId: string, status: Status) {
    const dbRef = ref(this.database);
    const userId = this.firebaseAuthService.getFirebaseUser()?.uid;

    const key = `notifications/${userId}/${orderId}/status`;
    return fromPromise(update(dbRef, { [key]: status }));
  }
}
