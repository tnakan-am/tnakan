import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Product } from '../interfaces/product.interface';
import { openSnackBar } from '../helpers/snackbar';
import { AuthService } from './auth.service';

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private snackBar = openSnackBar();

  private readonly base = `${environment.apiUrl}/products`;

  deleteProduct(id: string): Observable<{ success: boolean }> {
    return this.http
      .delete<{ success: boolean }>(`${this.base}/${id}`)
      .pipe(tap(() => this.snackBar('Successfully Deleted')));
  }

  getAllUnapprovedProducts(): Observable<Product[]> {
    return this.listProducts({ approved: 'false', limit: 100 });
  }

  getUserProducts(): Observable<Product[]> {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return of([]);
    return this.listProducts({ userId, limit: 100 });
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.base, product);
  }

  updateProduct(product: Partial<Product>, id: string): Observable<Product> {
    return this.http.patch<Product>(`${this.base}/${id}`, product);
  }

  approveOrBlockProduct(product: Partial<Product>, id: string): Observable<Product> {
    return this.http.patch<Product>(`${this.base}/${id}/approve`, { approved: product.approved });
  }

  batchUpdateProductsByUserId(product: Partial<Product>, userId: string): Observable<Product[]> {
    let params = new HttpParams().set('userId', userId);
    return this.http.patch<Product[]>(`${this.base}/batch`, product, { params });
  }

  getAllProducts(): Observable<Product[]> {
    return this.listProducts({ sortBy: 'avgReview', sortOrder: 'DESC', limit: 100 });
  }

  getTopProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/top`);
  }

  getAllProductsBySeller(id: string): Observable<Product[]> {
    return this.listProducts({ userId: id, limit: 100 });
  }

  getAllProductsByQuery(params: {
    subCategory?: string;
    category?: string;
    productCategory?: string;
  }): Observable<Product[]> {
    return this.listProducts({
      ...params,
      sortBy: 'avgReview',
      sortOrder: 'DESC',
      limit: 100,
    });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  private listProducts(
    query: Record<string, string | number | boolean | undefined>
  ): Observable<Product[]> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http
      .get<PaginatedResponse<Product>>(this.base, { params })
      .pipe(map((res) => res.data));
  }
}
