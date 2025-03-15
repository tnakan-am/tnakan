import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';

import { FirebaseAuthService } from './firebase-auth.service';
import { ProductsService } from './products.service';
import { openSnackBar } from '../helpers/snackbar';
import { Order, OrderItem } from '../interfaces/order.interface';
import { Database } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class AdminOrderService {
  firestore: Firestore = inject(Firestore);
  database = inject(Database);
  firebaseAuthService = inject(FirebaseAuthService);
  productsService = inject(ProductsService);
  snackBar = openSnackBar();

  constructor() {}

  async getBusinessOrders(startDate: Date, endDate: Date): Promise<Order[]> {
    // Build your query
    const q = query(
      collection(this.firestore, 'orders'),
      where('createdAt', '>=', startDate.toISOString()),
      where('createdAt', '<=', endDate.toISOString()),
      orderBy('createdAt', 'desc')
    );

    // Execute the Firestore query
    const querySnapshot = await getDocs(q);

    // Prepare an array for the final output
    const data: Order[] = [];

    // Use a for-of loop so we can await inside
    for (const orderSnapshot of querySnapshot.docs) {
      const docData = orderSnapshot.data() as Order;

      // Get the sub-collection and fetch all products
      const orderDocRef = doc(this.firestore, 'orders', orderSnapshot.id);
      const productsCollectionRef = collection(orderDocRef, 'products');
      const productsSnapshot = await getDocs(productsCollectionRef);

      // Build an array of products
      const products: OrderItem[] = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OrderItem[];

      // Push this order + products into our final array
      data.push({
        ...docData,
        orderId: orderSnapshot.id,
        products: products,
      });
    }

    return data;
  }
}
