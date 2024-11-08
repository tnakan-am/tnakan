import { inject, Injectable } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { FirebaseAuthService } from './firebase-auth.service';
import { ProductsService } from './products.service';
import { OrderItem } from '../interfaces/order.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  firestore: Firestore = inject(Firestore);
  firebaseAuthService = inject(FirebaseAuthService);
  productsService = inject(ProductsService);

  constructor() {}

  writeReview(product: OrderItem, review: { stars: number; comment: string }) {
    const userId = this.firebaseAuthService.getFirebaseUser()?.uid!;

    const reviewRef = doc(this.firestore, 'reviews', product.id);

    return fromPromise(
      setDoc(
        reviewRef,
        {
          [product.orderId!]: { ...review, userId },
        },
        { merge: true }
      )
    );
  }

  getOrderReview(product: OrderItem): Observable<any> {
    const reviewRef = doc(this.firestore, 'reviews', product.id);

    return fromPromise(
      getDoc(reviewRef).then((docSnap) =>
        docSnap.exists() ? docSnap.data()[product.orderId!] : null
      )
    );
  }
}
