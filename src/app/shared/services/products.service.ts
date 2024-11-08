import { inject, Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { catchError, filter, Observable, switchMap, tap, throwError } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth.service';
import { User } from '@angular/fire/auth';
import { Product } from '../interfaces/product.interface';
import { openSnackBar } from '../helpers/snackbar';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  firestore = inject(Firestore);
  firebaseAuthService = inject(FirebaseAuthService);
  snackBar = openSnackBar();

  constructor() {}

  deleteProduct(id: string) {
    return fromPromise(deleteDoc(doc(this.firestore, 'products', id))).pipe(
      tap((value) => this.snackBar('Successfully Deleted')),
      catchError((err) => {
        this.snackBar(err);
        return throwError(err);
      })
    );
  }

  getUserProducts(): Observable<Product[]> {
    const user = this.firebaseAuthService.user$;

    return user.pipe(
      filter((user) => !!user?.uid),
      switchMap((user) =>
        fromPromise(
          getDocs(
            query(
              collection(this.firestore, 'products'),
              where('userId', '==', (user as User)?.uid)
            )
          ).then((values) => {
            const data: any[] = [];
            values.forEach((value) => data.push({ id: value.id, ...value.data() }));
            return data;
          })
        )
      )
    );
  }

  createProduct(product: Product): Observable<void> {
    const productRef = doc(collection(this.firestore, 'products'));
    return fromPromise(setDoc(productRef, product, { merge: true }));
  }

  updateProduct(product: Product, id: string): Observable<void> {
    const productRef = doc(this.firestore, 'products', id);
    return fromPromise(setDoc(productRef, product, { merge: true }));
  }

  updateProductAvailability(qnt: number, id: string): Observable<void> {
    const productRef = doc(this.firestore, 'products', id);

    return fromPromise(
      getDoc(productRef).then((product) => {
        if (product.exists()) {
          if (product.data()['availability'] === 'unlimited') {
            return Promise.resolve();
          } else if (product.data()['availability'] >= qnt)
            return setDoc(
              productRef,
              { availability: product.data()?.['availability'] - qnt },
              { merge: true }
            );
          throw new Error('Quantity unavailable');
        }
        throw new Error("doesn't exist");
      })
    );
  }

  updateProductReview(qnt: number, id: string): Observable<void> {
    const productRef = doc(this.firestore, 'products', id);

    return fromPromise(
      getDoc(productRef).then((product) => {
        if (product.exists()) {
          if (product.data()['avgReview'] >= qnt)
            return setDoc(
              productRef,
              { availability: product.data()?.['availability'] - qnt },
              { merge: true }
            );
          throw new Error('Quantity unavailable');
        }
        throw new Error("doesn't exist");
      })
    );
  }

  batchUpdateProductsByUserId(product: Partial<Product>, userId: string): Observable<any> {
    const batch = writeBatch(this.firestore);
    const q = query(collection(this.firestore, 'products'), where('userId', '==', userId));
    return fromPromise(
      getDocs(q)
        .then((values) => {
          values.forEach((value) => {
            const ref = doc(this.firestore, 'products', value.id);
            batch.set(ref, { ...value.data(), ...product });
          });
          return batch.commit();
        })
        .catch((err) => {
          this.snackBar(err);
        })
    );
  }

  getAllProducts(): Observable<Product[]> {
    return fromPromise(
      getDocs(query(collection(this.firestore, 'products'))).then((values) => {
        const data: any[] = [];
        values.forEach((value) => data.push({ id: value.id, ...value.data() }));
        return data;
      })
    );
  }

  getProduct(): Observable<Product[]> {
    return fromPromise(
      getDocs(query(collection(this.firestore, 'products'))).then((values) => {
        const data: any[] = [];
        values.forEach((value) => data.push({ id: value.id, ...value.data() }));
        return data;
      })
    );
  }
}
