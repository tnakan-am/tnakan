import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SidebarHttpService } from '../shared/services/sidebar-http.service';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';

export interface SideBarMenu {
  categoryName: string;
  categoryId: string;
  selected?: boolean;
  categories: SideBarMenu[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatButtonModule, FormsModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  isOpen: boolean = false;
  menuList: SideBarMenu[] = [];

  sidebarHttpService = inject(SidebarHttpService);

  constructor() {}

  ngOnInit(): void {
    this.getCategoriesData();
  }

  private getCategoriesData(): void {
    forkJoin([
      this.sidebarHttpService.getCategoriesList(),
      this.sidebarHttpService.getSubCategoriesList(),
      this.sidebarHttpService.getProductCategoriesList(),
    ]).subscribe(([categories, subCategories, productCategories]) => {
      this.menuList = categories.map((category: any) => {
        return {
          categoryName: category.name,
          categoryId: category.id,
          selected: false,
          categories: subCategories
            .filter((subCategory: any) => subCategory.category_id === category.id)
            .map((subCategory1: any) => {
              return {
                categoryName: subCategory1.name,
                categoryId: subCategory1.id,
                selected: false,
                categories: productCategories
                  .filter(
                    (productCategory: any) => productCategory.sub_category_id === subCategory1.id
                  )
                  .map((productCategoryItem: any) => {
                    return {
                      categoryName: productCategoryItem.name,
                      categoryId: productCategoryItem.id,
                      selected: false,
                    };
                  }) as SideBarMenu[],
              };
            }) as SideBarMenu[],
        };
      });
    });
  }

  openSub(event: MouseEvent, menuItem: any) {
    // this.isOpen = !this.isOpen;
    event.stopPropagation();
    event.stopImmediatePropagation();
    menuItem.selected = !menuItem.selected;
  }
}
