import { CategoryTree } from '../../interfaces/categories.interface';
import { Product } from '../../interfaces/product.interface';

export interface DialogData {
  name: string;
  userId: string;
  categories: Array<CategoryTree>;
  form?: Product;
}
