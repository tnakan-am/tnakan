import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Category, ProductCategory, SubCategory } from '../interfaces/categories.interface';

@Injectable({ providedIn: 'root' })
export class SidebarHttpService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCategoriesList(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getProductCategoriesList(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.apiUrl}/product-categories`);
  }

  getSubCategoriesList(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${this.apiUrl}/sub-categories`);
  }
}
