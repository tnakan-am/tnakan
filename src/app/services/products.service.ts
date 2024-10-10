import { inject, Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { catchError, filter, Observable, switchMap, tap, throwError } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth.service';
import { User } from '@angular/fire/auth';
import { Product } from '../interfaces/product.interface';
import { openSnackBar } from '../helpers/snackbar';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  firestore = inject(Firestore);
  storage = inject(Storage);
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

  getAllProducts(): Observable<Product[]> {
    return fromPromise(
      getDocs(query(collection(this.firestore, 'products'))).then((values) => {
        const data: any[] = [];
        values.forEach((value) => data.push({ id: value.id, ...value.data() }));
        return data;
      })
    );
  }

  uploadFile(file: any): Observable<string> {
    const filePath = `uploads/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const task = uploadBytes(fileRef, file);

    return fromPromise(task.then(() => getDownloadURL(fileRef)));
  }
}
