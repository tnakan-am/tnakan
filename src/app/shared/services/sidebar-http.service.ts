import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category, ProductCategory, SubCategory } from '../interfaces/categories.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({ providedIn: 'root' })
export class SidebarHttpService {
  private firestore: Firestore = inject(Firestore);

  getCategoriesList(): Observable<Category[]> {
    const categoriesRef = collection(this.firestore, 'categories');
    return fromPromise(
      getDocs(categoriesRef).then((querySnapshot) => {
        return querySnapshot.docs.map((docSnap) => {
          return { id: docSnap.id, ...docSnap.data() } as Category;
        });
      })
    );
  }

  getProductCategoriesList(): Observable<ProductCategory[]> {
    const productCategoriesRef = collection(this.firestore, `product_categories`);
    return fromPromise(
      getDocs(productCategoriesRef).then((querySnapshot) => {
        return querySnapshot.docs.map((docSnap) => {
          return { id: docSnap.id, ...docSnap.data() } as ProductCategory;
        });
      })
    );
  }

  getSubCategoriesList(): Observable<SubCategory[]> {
    const subCategoriesRef = collection(this.firestore, `sub_category`);
    return fromPromise(
      getDocs(subCategoriesRef).then((querySnapshot) => {
        return querySnapshot.docs.map((docSnap) => {
          return { id: docSnap.id, ...docSnap.data() } as SubCategory;
        });
      })
    );
  }
}
