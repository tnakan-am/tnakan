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
import { catchError, forkJoin, Observable, of, switchMap, throwError } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { openSnackBar } from '../helpers/snackbar';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  database = inject(Database);
  firestore: Firestore = inject(Firestore);
  firebaseAuthService = inject(FirebaseAuthService);
  productsService = inject(ProductsService);
  snackBar = openSnackBar();
  newOrders: WritableSignal<Notification[]> = signal([]);

  constructor() {}

  addOrder(order: Order) {
    return forkJoin(
      order.products.map((product) =>
        this.productsService.updateProductAvailability(product.quantity, product.id)
      )
    ).pipe(
      catchError((error: Error) => throwError(() => error)),
      switchMap(async (value) => {
        try {
          const key = push(child(ref(this.database), 'orders')).key;
          const user = this.firebaseAuthService.getFirebaseUser();
          const userId = user?.uid;
          const userPhone = user?.phoneNumber;
          const createdAt = new Date().toISOString();
          const data = {
            ...order,
            userId,
            createdAt,
            userPhone,
          };
          await set(ref(this.database, 'orders/' + key), data);
          data.products.forEach(async (value) => {
            await set(ref(this.database, 'notifications/' + value.userId + '/' + key), {
              createdAt,
              orderId: key,
              productIds: data.products
                .filter((value1) => value1.userId === userId)
                .map((value1) => value1.id),
              status: Status.pending,
            });
          });
        } catch (error) {
          this.snackBar(
            (error as any)?.customData?._tokenResponse?.error?.message || (error as any)?.message
          );
        }
      })
    );
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

  changeNotificationStatus(order: Order, status: Status) {
    const dbRef = ref(this.database);
    const userId = this.firebaseAuthService.getFirebaseUser()?.uid;

    const key = `notifications/${userId}/${order.orderId}/status`;
    const orderStatusHistoryKey = `orders/${order.orderId}/statusHistory`;
    return fromPromise(
      Promise.all([
        this.changeProductsStatus(order, status),
        update(dbRef, { [key]: status }),
        push(child(ref(this.database), orderStatusHistoryKey), {
          userId,
          status,
          createdAt: new Date().toISOString(),
        }),
      ])
    );
  }

  changeProductsStatus(order: Order, status: Status) {
    const dbRef = ref(this.database);
    const dbOrder = get(child(dbRef, `orders/${order.orderId}`));
    const userId = this.firebaseAuthService.getFirebaseUser()?.uid;

    const productsIndexes = order.products.reduce(
      (previousValue: number[], currentValue, currentIndex) => {
        if (currentValue.userId === userId) {
          previousValue.push(currentIndex);
        }
        return previousValue;
      },
      []
    );

    const key = `notifications/${userId}/${order.orderId}/status`;
    const promiseArr: Promise<any>[] = [];

    const orderStatusHistoryKey = `orders/${order.orderId}/statusHistory`;
    if (productsIndexes.length) {
      promiseArr.push(
        ...productsIndexes.map((val) =>
          update(dbRef, { [`orders/${order.orderId}/products/` + val + '/status']: status })
        )
      );
    }
    return dbOrder
      .then((values) => {
        if (productsIndexes.length === values.val()?.products.length) {
          promiseArr.push(update(dbRef, { [`orders/${order.orderId}/status`]: status }));
        }
        return values.val();
      })
      .then((orderReal) =>
        Promise.all([
          ...promiseArr,
          update(dbRef, { [key]: status }),
          push(child(ref(this.database), orderStatusHistoryKey), {
            userId,
            status,
            createdAt: new Date().toISOString(),
          }),
        ])
      );
  }
}
