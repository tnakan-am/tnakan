export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface ProductCategory {
  id: string;
  subCategoryId: string;
  name: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface SubCategoryWithChildren extends SubCategory {
  productCategories: ProductCategory[];
}

export interface CategoryTree extends Category {
  subCategories: SubCategoryWithChildren[];
}
