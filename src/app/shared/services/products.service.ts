import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { catchError, filter, Observable, switchMap, tap, throwError } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth.service';
import { User } from '@angular/fire/auth';
import { Product } from '../interfaces/product.interface';
import { openSnackBar } from '../helpers/snackbar';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

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
      tap(() => this.snackBar('Successfully Deleted')),
      catchError((err) => {
        this.snackBar(err);
        return throwError(err);
      })
    );
  }

  getAllUnapprovedProducts(): Observable<Product[]> {
    return fromPromise(
      getDocs(query(collection(this.firestore, 'products'), where('approved', '==', false))).then(
        (values) => {
          const data: any[] = [];
          values.forEach((value) => data.push({ id: value.id, ...value.data() }));
          return data;
        }
      )
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
    return fromPromise(
      setDoc(productRef, { ...product, avgReview: 0, numberReview: 0 }, { merge: true })
    );
  }

  updateProduct(product: Partial<Product>, id: string): Observable<void> {
    const productRef = doc(this.firestore, 'products', id);
    return fromPromise(setDoc(productRef, product, { merge: true }));
  }

  approveOrBlockProduct(product: Partial<Product>, id: string): Observable<void> {
    const productRef = doc(this.firestore, 'products', id);
    return fromPromise(setDoc(productRef, { approved: product.approved }, { merge: true }));
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
      getDocs(query(collection(this.firestore, 'products'), limit(100))).then((values) => {
        const data: any[] = [];
        values.forEach((value) => data.push({ id: value.id, ...value.data() }));
        return data;
      })
    );
  }

  getAllProductsBySeller(id: string): Observable<Product[]> {
    return fromPromise(
      getDocs(query(collection(this.firestore, 'products'), where('userId', '==', id))).then(
        (values) => {
          const data: any[] = [];
          values.forEach((value) => data.push({ id: value.id, ...value.data() }));
          return data;
        }
      )
    );
  }

  getAllProductsByQuery(params: {
    subCategory?: string;
    category?: string;
    productCategory?: string;
  }): Observable<Product[]> {
    return fromPromise(
      getDocs(
        query(
          collection(this.firestore, 'products'),
          where(
            params.category
              ? 'category'
              : params.productCategory
              ? 'productCategory'
              : 'subCategory',
            '==',
            params.category || params.productCategory || params.subCategory
          ),
          limit(100)
        )
      ).then((values) => {
        const data: any[] = [];
        values.forEach((value) => data.push({ id: value.id, ...value.data() }));
        return data;
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    const productRef = doc(this.firestore, `products/${id}`);
    return fromPromise(
      getDoc(productRef).then((docSnap) => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Product;
        } else {
          throw new Error('No such document!');
        }
      })
    );
  }
}
