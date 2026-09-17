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
import { TranslateModule } from '@ngx-translate/core';
import { MatBadge } from '@angular/material/badge';
import { AuthService } from '../shared/services/auth.service';
import { BasketService } from '../shared/services/basket.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { FoodCategoriesService } from '../shared/services/food-categories.service';
import { Notification } from '../shared/interfaces/order.interface';

/** Most top-level categories the bar will ever show inline; width trims this further. */
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
  /** Every category, for the always-present bar entry that reaches the ones the bar drops. */
  allCategories = computed(() => this.foodCategories.tree());
  searchTerm = '';

  @Output() sidenavStatus = new EventEmitter<boolean>();

  private isOpenedSidenav = false;
  private fAuth = inject(AuthService);
  private basketService = inject(BasketService);
  private ordersService = inject(NotificationsService);
  private foodCategories = inject(FoodCategoriesService);
  private router = inject(Router);

  constructor() {
    this.user = this.fAuth.currentUser;
    this.basket = this.basketService.basket;
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
