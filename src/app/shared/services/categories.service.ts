import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import {
  Category,
  CategoryTree,
  Data,
  ProductCategory,
  ProductCategoryData,
  SubCategoryData,
} from '../interfaces/categories.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  firestore = inject(Firestore);

  constructor() {}

  getCategories(): Observable<Category[]> {
    return fromPromise(
      getDocs(query(collection(this.firestore, 'categories'))).then((values) => {
        const data: Category[] = [];
        values.forEach((value1) => {
          data.push({ id: value1.id, data: value1.data() as Data });
        });
        return data;
      })
    );
  }

  getCategoriesTree(): Observable<CategoryTree[]> {
    return fromPromise(getDocs(query(collection(this.firestore, 'categories')))).pipe(
      map((value) => {
        const data: any[] = [];
        value.forEach(async (doc) => {
          const item: Category & {
            sub: { id: string; data: SubCategoryData; productCategories: ProductCategory[] }[];
          } = {
            id: doc.id,
            data: doc.data() as Data,
            sub: [],
          };
          const querySnapshot = await getDocs(
            query(collection(this.firestore, 'sub_category'), where('category_id', '==', doc.ref))
          );
          querySnapshot.forEach(async (doc1) => {
            const productCategories: ProductCategory[] = [];
            const querySnapshot1 = await getDocs(
              query(
                collection(this.firestore, 'product_categories'),
                where('sub_category_id', '==', doc1.ref)
              )
            );

            querySnapshot1.forEach((doc2) => {
              productCategories.push({ id: doc2.id, data: doc2.data() as ProductCategoryData });
            });
            item.sub.push({ id: doc1.id, data: doc1.data() as SubCategoryData, productCategories });
          });
          data.push(item);
        });
        return data;
      }),
      shareReplay(1)
    );
  }
}
