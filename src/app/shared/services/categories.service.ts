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
    return fromPromise(
      getDocs(query(collection(this.firestore, 'categories'))).then(async (values) => {
        const data: CategoryTree[] = [];

        for (const doc of values.docs) {
          const item: CategoryTree = {
            id: doc.id,
            data: doc.data() as Data,
            sub: [],
          };

          const subSnapshot = await getDocs(
            query(collection(this.firestore, 'sub_category'), where('category_ref', '==', doc.ref))
          );

          for (const subDoc of subSnapshot.docs) {
            const productSnapshot = await getDocs(
              query(collection(this.firestore, 'product_categories'), where('sub_category_ref', '==', subDoc.ref))
            );

            const productCategories: ProductCategory[] = productSnapshot.docs.map((doc2) => ({
              id: doc2.id,
              data: doc2.data() as ProductCategoryData,
            }));

            item.sub.push({
              id: subDoc.id,
              data: subDoc.data() as SubCategoryData,
              productCategories,
            });
          }

          data.push(item);
        }

        return data;
      })
    ).pipe(shareReplay(1));
  }
}
