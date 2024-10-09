import { DocumentReference } from '@angular/fire/compat/firestore';

export interface Sub extends SubCategory {
  productCategories: ProductCategory[];
}
export interface CategoryTree extends Category {
  sub: Sub[];
}

export interface Category {
  id: string;
  data: Data;
}

export interface Data {
  name: string;
  description: string;
}

export interface SubCategory {
  id: string;
  data: SubCategoryData;
}

export interface SubCategoryData {
  name: string;
  category_id: DocumentReference;
}

export interface ProductCategory {
  id: string;
  data: ProductCategoryData;
}

export interface ProductCategoryData {
  name: string;
  sub_category_id: DocumentReference;
}
