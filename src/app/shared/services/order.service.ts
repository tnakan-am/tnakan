import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
// 👇  switch to the Web-SDK helpers ↓↓↓
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

import { FirebaseAuthService } from './firebase-auth.service';
import { ProductsService } from './products.service';
import { openSnackBar } from '../helpers/snackbar';
import { catchError, forkJoin, switchMap, throwError } from 'rxjs';
import { Order, OrderItem, Status } from '../interfaces/order.interface';
import { Database, ref, set } from '@angular/fire/database';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  firestore: Firestore = inject(Firestore);
  database = inject(Database);
  firebaseAuthService = inject(FirebaseAuthService);
  productsService = inject(ProductsService);
  snackBar = openSnackBar();

  constructor() {}

  addOrder(order: Order) {
    return forkJoin(
      order.products.map((product) =>
        this.productsService.updateProductAvailability(product.quantity, product.id)
      )
    ).pipe(
      catchError((error: Error) => throwError(() => error)),
      switchMap(async () => {
        try {
          const user = this.firebaseAuthService.getFirebaseUser();
          const userId = user?.uid;
          const userPhone = user?.phoneNumber;
          const createdAt = new Date().toISOString();
          const vendorIds = Array.from(new Set(order.products.map((product) => product.userId)));
          const orderData: any = { ...order };
          const products = [...order.products];
          delete orderData.products;
          const docRef = await addDoc(collection(this.firestore, 'orders'), {
            ...orderData,
            userId,
            userPhone,
            createdAt,
            vendorIds,
            productsIds: products.map((product) => product.id),
          });

          products.forEach(async (value) => {
            await setDoc(doc(this.firestore, 'orders', docRef.id, 'products', value.id), value);

            await set(ref(this.database, 'notifications/' + value.userId + '/' + docRef.id), {
              createdAt,
              orderId: docRef.id,
              productIds: order.products
                .filter((value1) => value1.userId === userId)
                .map((value1) => value1.id),
              status: Status.pending,
            });
          });
        } catch (e) {
          this.snackBar(
            (e as any)?.customData?._tokenResponse?.error?.message || (e as any)?.message
          );
        }
      })
    );
  }

  getBusinessOrders() {
    const data: any[] = [];
    const userId = this.firebaseAuthService.getFirebaseUser()?.uid!;

    const q = query(
      collection(this.firestore, 'orders'),
      where('vendorIds', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );

    return fromPromise(
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach(async (orderSnapshot) => {
          const docData = orderSnapshot.data() as Order;
          const orderDocRef = doc(this.firestore, 'orders', orderSnapshot.id);
          const productsCollectionRef = collection(orderDocRef, 'products');
          const productsSnapshot = await getDocs(productsCollectionRef);
          const products: OrderItem[] = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as OrderItem[];
          data.push({
            ...docData,
            orderId: orderSnapshot.id,
            products: products.filter((product) => product.userId === userId),
          });
        });
        return data;
      })
    );
  }

  getCustomerOrders() {
    const userId = this.firebaseAuthService.getFirebaseUser()?.uid!;
    const data: any[] = [];
    const q = query(
      collection(this.firestore, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return fromPromise(
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach(async (orderSnapshot) => {
          const docData = orderSnapshot.data() as Order;
          const orderDocRef = doc(this.firestore, 'orders', orderSnapshot.id);
          const productsCollectionRef = collection(orderDocRef, 'products');
          const productsSnapshot = await getDocs(query(productsCollectionRef));
          const products: OrderItem[] = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            orderId: orderSnapshot.id,
            ...doc.data(),
          })) as OrderItem[];
          data.push({
            ...docData,
            orderId: orderSnapshot.id,
            products: products,
          });
        });
        return data;
      })
    );
  }
}
