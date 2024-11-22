import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { FirebaseAuthService } from './firebase-auth.service';
import { OrderItem } from '../interfaces/order.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { catchError, filter, forkJoin, Observable, switchMap, throwError } from 'rxjs';
import { UsersService } from './users.service';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  firestore: Firestore = inject(Firestore);
  firebaseAuthService = inject(FirebaseAuthService);
  userService = inject(UsersService);
  productService = inject(ProductsService);

  constructor() {}

  writeReview(product: OrderItem, review: { stars: number; comment: string }) {
    const userId = this.firebaseAuthService.getFirebaseUser()?.uid!;
    return this.userService.getUserData().pipe(
      filter((user) => !!user),
      switchMap((user) => {
        const reviewRef = collection(this.firestore, 'reviews');

        return forkJoin([
          this.productService.updateProduct(
            {
              numberReview: (product.numberReview || 0) + 1,
              avgReview: calculateNewAverage(product.numberReview, product.avgReview, review.stars),
            },
            product.id
          ),
          fromPromise(
            addDoc(reviewRef, {
              ...review,
              userId,
              productId: product.id,
              userPhoto: user?.image || null,
              userName: user?.displayName,
              orderId: product.orderId,
              createdAt: new Date().toISOString(),
            }).then(() => ({ ...review }))
          ),
        ]);
      }),
      catchError((err) => throwError(err))
    );
  }

  getProductReview(product: Partial<OrderItem>, orderId?: string): Observable<any> {
    const reviewRef = query(
      collection(this.firestore, 'reviews'),
      where(orderId ? 'orderId' : 'productId', '==', orderId ? orderId : product.id)
    );
    const reviews: any[] = [];

    return fromPromise(
      getDocs(reviewRef)
        .then((querySnapshot) =>
          querySnapshot.forEach((doc) =>
            doc.exists() ? reviews.push({ ...doc.data(), id: doc.id }) : null
          )
        )
        .then((value) =>
          orderId ? reviews.filter((value1) => value1.productId === product.id) : reviews
        )
    );
  }
}

function calculateNewAverage(
  currentReviews: number = 0,
  currentAverage: number = 0,
  newStars: number = 0
) {
  // Calculate the total stars from the current reviews
  const currentTotalStars = currentReviews * currentAverage;
  // Add the new review's stars to the total stars
  const newTotalStars = currentTotalStars + newStars;

  // Increment the number of reviews by 1
  const newTotalReviews = currentReviews + 1;

  // Calculate the new average
  const newAverage = newTotalStars / newTotalReviews;
  return newAverage;
}
