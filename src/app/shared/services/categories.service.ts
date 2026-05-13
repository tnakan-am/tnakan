import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Category, CategoryTree } from '../interfaces/categories.interface';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/categories`;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.base);
  }

  getCategoriesTree(): Observable<CategoryTree[]> {
    return this.http.get<CategoryTree[]>(`${this.base}/tree`).pipe(shareReplay(1));
  }
}
