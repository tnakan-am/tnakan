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

import { openSnackBar } from '../helpers/snackbar';
import { Order, OrderItem } from '../interfaces/order.interface';
import { Database } from '@angular/fire/database';
import groupBy from 'lodash-es/groupBy';

@Injectable({
  providedIn: 'root',
})
export class AdminOrderService {
  firestore: Firestore = inject(Firestore);
  database = inject(Database);
  snackBar = openSnackBar();

  constructor() {}

  async getBusinessOrders(startDate: Date, endDate: Date): Promise<{ [key: string]: OrderItem[] }> {
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
    const data: { [key: string]: OrderItem[] } = {};

    const orderPromises = querySnapshot.docs.map(async (orderSnapshot) => {
      const docData = orderSnapshot.data() as Order;
      const orderDocRef = doc(this.firestore, 'orders', orderSnapshot.id);
      const productsCollectionRef = collection(orderDocRef, 'products');
      const productsSnapshot = await getDocs(productsCollectionRef);

      return {
        orderId: orderSnapshot.id,
        products: productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          orderId: orderSnapshot.id,
          ...doc.data(),
        })) as OrderItem[],
      };
    });

    const results = await Promise.all(orderPromises);

    results.forEach(({ products }) => {
      const productsByUser = groupBy(products, 'userId');
      Object.keys(productsByUser).forEach((key) => {
        if (data[key]) {
          data[key].push(...productsByUser[key]);
        } else {
          data[key] = productsByUser[key];
        }
      });
    });

    return data;
  }
}
