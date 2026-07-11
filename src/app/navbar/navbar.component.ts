import {
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
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
import { AuthService } from '../shared/services/auth.service';
import { BasketService } from '../shared/services/basket.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { FoodCategoriesService } from '../shared/services/food-categories.service';
import { Notification } from '../shared/interfaces/order.interface';

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
  categories = computed(() => this.foodCategories.tree().slice(0, MAX_INLINE_CATEGORIES));
  searchTerm = '';

  @Output() sidenavStatus = new EventEmitter<boolean>();

  private isOpenedSidenav = false;
  private translateService = inject(TranslateService);
  private fAuth = inject(AuthService);
  private basketService = inject(BasketService);
  private ordersService = inject(NotificationsService);
  private foodCategories = inject(FoodCategoriesService);
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
}
