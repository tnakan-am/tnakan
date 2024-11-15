import { inject, Injectable } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { FirebaseAuthService } from './firebase-auth.service';
import { ProductsService } from './products.service';
import { OrderItem } from '../interfaces/order.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { catchError, filter, Observable, switchMap, throwError } from 'rxjs';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  firestore: Firestore = inject(Firestore);
  firebaseAuthService = inject(FirebaseAuthService);
  userService = inject(UsersService);
  productsService = inject(ProductsService);

  constructor() {}

  writeReview(product: OrderItem, review: { stars: number; comment: string }) {
    const userId = this.firebaseAuthService.getFirebaseUser()?.uid!;
    return this.userService.getUserData().pipe(
      filter((user) => !!user),
      switchMap((user) => {
        const reviewRef = doc(this.firestore, 'reviews', product.id);
        return fromPromise(
          setDoc(
            reviewRef,
            {
              [product.orderId!]: {
                ...review,
                userId,
                userPhoto: user?.image || null,
                userName: user?.displayName,
              },
            },
            { merge: true }
          ).then(() => ({ ...review }))
        );
      }),
      catchError((err) => throwError(err))
    );
  }

  getProductReview(product: Partial<OrderItem>): Observable<any> {
    const reviewRef = doc(this.firestore, 'reviews', product.id!);

    return fromPromise(
      getDoc(reviewRef).then((docSnap) =>
        docSnap.exists()
          ? product.orderId
            ? docSnap.data()[product.orderId!]
            : Object.keys(docSnap.data()).map((key) => ({ ...docSnap.data()[key], id: key }))
          : null
      )
    );
  }
}
