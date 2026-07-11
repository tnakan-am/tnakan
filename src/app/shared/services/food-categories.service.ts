import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Category, CategoryTree } from '../interfaces/categories.interface';
import { FOOD_CATEGORIES, LocalizedText } from '../data/food-categories';

/**
 * Localizes the static {@link FOOD_CATEGORIES} taxonomy into the shared `CategoryTree`
 * shape for the current UI language. Exposed as signals so consumers (header, drawer,
 * product forms) re-render automatically when the language is switched.
 *
 * Temporary stand-in for a backend category API — swap `FOOD_CATEGORIES` for an HTTP
 * source without touching consumers once categories are admin-managed.
 */
@Injectable({ providedIn: 'root' })
export class FoodCategoriesService {
  private readonly translate = inject(TranslateService);

  private readonly lang = signal(
    localStorage.getItem('lang') ?? this.translate.currentLang ?? this.translate.defaultLang ?? 'hy'
  );

  /** Full localized category tree (Category → SubCategory → ProductCategory). */
  readonly tree = computed<CategoryTree[]>(() => {
    const lang = this.lang();
    const t = (text: LocalizedText) => text[lang as keyof LocalizedText] ?? text.hy;

    return FOOD_CATEGORIES.map((category) => ({
      id: category.id,
      name: t(category.name),
      subCategories: category.subCategories.map((sub) => ({
        id: sub.id,
        categoryId: category.id,
        name: t(sub.name),
        productCategories: sub.productCategories.map((pc) => ({
          id: pc.id,
          subCategoryId: sub.id,
          name: t(pc.name),
        })),
      })),
    }));
  });

  /** Flat top-level categories, localized. */
  readonly categories = computed<Category[]>(() =>
    this.tree().map(({ subCategories, ...category }) => category)
  );

  constructor() {
    this.translate.onDefaultLangChange.subscribe(({ lang }) => this.lang.set(lang));
    this.translate.onLangChange.subscribe(({ lang }) => this.lang.set(lang));
  }
}
