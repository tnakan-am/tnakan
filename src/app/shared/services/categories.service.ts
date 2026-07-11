import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Category, CategoryTree } from '../interfaces/categories.interface';
import { FoodCategoriesService } from './food-categories.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private foodCategories = inject(FoodCategoriesService);

  getCategories(): Observable<Category[]> {
    return of(this.foodCategories.categories());
  }

  getCategoriesTree(): Observable<CategoryTree[]> {
    return of(this.foodCategories.tree());
  }
}
