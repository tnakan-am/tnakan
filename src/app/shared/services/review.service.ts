import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { OrderItem } from '../interfaces/order.interface';
import { Review } from '../interfaces/reviews.interface';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/reviews`;

  writeReview(product: OrderItem, review: { stars: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(this.base, {
      productId: product.productId,
      orderId: product.orderId,
      stars: review.stars,
      comment: review.comment,
    });
  }

  getProductReview(product: Partial<OrderItem>, orderId?: string): Observable<Review[]> {
    const params = new HttpParams().set('productId', product.id ?? '');
    return this.http.get<Review[]>(this.base, { params });
  }
}
