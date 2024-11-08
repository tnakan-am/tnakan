import { Product } from './product.interface';
import { CategoryTree } from './categories.interface';

export interface DialogData {
  name: string;
  userId: string;
  categories: Array<CategoryTree>;
  form?: Product;
}
