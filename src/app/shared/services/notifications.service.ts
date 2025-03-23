import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Database, onValue, orderByChild, query, ref, update } from '@angular/fire/database';
import { Notification, Order, Status } from '../interfaces/order.interface';
import { addDoc, collection, doc, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { FirebaseAuthService } from './firebase-auth.service';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  database = inject(Database);
  firestore: Firestore = inject(Firestore);
  firebaseAuthService = inject(FirebaseAuthService);
  newOrders: WritableSignal<Notification[]> = signal([]);

  constructor() {}

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

  changeNotificationStatus(order: Order, status: Status) {
    const dbRef = ref(this.database);
    const userId = this.firebaseAuthService.getFirebaseUser()?.uid;

    const key = `notifications/${userId}/${order.orderId}/status`;
    const orderStatusHistoryRef = collection(
      this.firestore,
      `orders`,
      order.orderId,
      `statusHistory`
    );
    return fromPromise(
      Promise.all([
        this.changeProductsStatus(order, status),
        update(dbRef, { [key]: status }),
        addDoc(orderStatusHistoryRef, {
          userId,
          status,
          createdAt: new Date().toISOString(),
        }),
      ])
    );
  }

  changeProductsStatus(order: Order, status: Status) {
    const dbRef = ref(this.database);

    const orderDocRef = doc(this.firestore, 'orders', order.orderId);
    // Retrieve the document data
    const dbOrder = getDoc(orderDocRef);
    const userId = this.firebaseAuthService.getFirebaseUser()?.uid;

    const productsIds = order.products.reduce((previousValue: string[], currentValue) => {
      if (currentValue.userId === userId) {
        previousValue.push(currentValue.id);
      }
      return previousValue;
    }, []);

    const key = `notifications/${userId}/${order.orderId}/status`;
    const promiseArr: Promise<any>[] = [];

    if (productsIds.length) {
      promiseArr.push(
        ...productsIds.map((val) =>
          updateDoc(doc(this.firestore, 'orders', order.orderId, 'products', val), { status })
        )
      );
    }
    return dbOrder
      .then((values) => {
        if (productsIds.length === values.data()?.['productsIds']?.length) {
          promiseArr.push(updateDoc(orderDocRef, { [`status`]: status }));
        }
        return values.data();
      })
      .then((orderReal) =>
        Promise.all([
          ...promiseArr,
          update(dbRef, { [key]: status }),
          addDoc(collection(this.firestore, 'orders', order.orderId, 'statusHistory'), {
            userId,
            status,
            createdAt: new Date().toISOString(),
          }),
        ])
      );
  }
}
