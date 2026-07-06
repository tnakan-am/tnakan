import {
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
  WritableSignal,
  effect,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatBadge } from '@angular/material/badge';
import { forkJoin } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { BasketService } from '../shared/services/basket.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { SidebarHttpService } from '../shared/services/sidebar-http.service';
import { Notification } from '../shared/interfaces/order.interface';

interface NavProductCategory {
  id: string;
  name: string;
}

interface NavSubCategory {
  id: string;
  name: string;
  productCategories: NavProductCategory[];
}

interface NavCategory {
  id: string;
  name: string;
  subCategories: NavSubCategory[];
}

/** Top-level categories shown inline in the header before overflowing into the mobile drawer. */
const MAX_INLINE_CATEGORIES = 7;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatIconAnchor,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatToolbar,
    MatBadge,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  user;
  basket;
  notifications?: WritableSignal<Notification[]>;
  categories = signal<NavCategory[]>([]);
  searchTerm = '';

  @Output() sidenavStatus = new EventEmitter<boolean>();

  private isOpenedSidenav = false;
  private translateService = inject(TranslateService);
  private fAuth = inject(AuthService);
  private basketService = inject(BasketService);
  private ordersService = inject(NotificationsService);
  private categoriesHttp = inject(SidebarHttpService);
  private router = inject(Router);

  constructor() {
    this.user = this.fAuth.currentUser;
    this.basket = this.basketService.basket;
    if (localStorage.getItem('lang')) {
      this.translateService.setDefaultLang(localStorage.getItem('lang') as string);
    } else {
      this.translateService.setDefaultLang('hy');
    }
    effect(() => {
      if (this.user()?.type === 'business' && !this.notifications) {
        this.notifications = this.ordersService.newOrders;
      }
    });
    this.loadCategories();
  }

  logout(): void {
    this.fAuth.logout();
  }

  redirectToOrders(): void {
    const user = this.user();
    if (!user) return;
    this.router.navigate(['/profile', user.type, 'orders']);
  }

  submitSearch(): void {
    const term = this.searchTerm.trim();
    this.router.navigate(['/'], { queryParams: term ? { search: term } : {} });
  }

  toggleSidebar(): void {
    this.isOpenedSidenav = !this.isOpenedSidenav;
    this.sidenavStatus.emit(this.isOpenedSidenav);
  }

  private loadCategories(): void {
    forkJoin([
      this.categoriesHttp.getCategoriesList(),
      this.categoriesHttp.getSubCategoriesList(),
      this.categoriesHttp.getProductCategoriesList(),
    ]).subscribe(([categories, subCategories, productCategories]) => {
      const tree = categories.slice(0, MAX_INLINE_CATEGORIES).map((category) => ({
        id: category.id,
        name: category.name,
        subCategories: subCategories
          .filter((sub) => sub.categoryId === category.id)
          .map((sub) => ({
            id: sub.id,
            name: sub.name,
            productCategories: productCategories
              .filter((pc) => pc.subCategoryId === sub.id)
              .map((pc) => ({ id: pc.id, name: pc.name })),
          })),
      }));
      this.categories.set(tree);
    });
  }
}
