import { Component, effect, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FoodCategoriesService } from '../shared/services/food-categories.service';
import { CategoryTree } from '../shared/interfaces/categories.interface';

export interface SideBarMenu {
  categoryName: string;
  categoryId: string;
  selected?: boolean;
  categories: SideBarMenu[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, FormsModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isOpen: boolean = false;
  menuList: SideBarMenu[] = [];

  private foodCategories = inject(FoodCategoriesService);

  constructor() {
    effect(() => {
      this.menuList = this.toMenu(this.foodCategories.tree());
    });
  }

  private toMenu(tree: CategoryTree[]): SideBarMenu[] {
    return tree.map((category) => ({
      categoryName: category.name,
      categoryId: category.id,
      selected: false,
      categories: category.subCategories.map((sub) => ({
        categoryName: sub.name,
        categoryId: sub.id,
        selected: false,
        categories: sub.productCategories.map((pc) => ({
          categoryName: pc.name,
          categoryId: pc.id,
          selected: false,
          categories: [],
        })),
      })),
    }));
  }

  openSub(event: MouseEvent, menuItem: SideBarMenu) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    menuItem.selected = !menuItem.selected;
  }
}
