import {
  Component,
  computed,
  DestroyRef,
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
import { TranslateModule } from '@ngx-translate/core';
import { MatBadge } from '@angular/material/badge';
import { AuthService } from '../shared/services/auth.service';
import { BasketService } from '../shared/services/basket.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { FoodCategoriesService } from '../shared/services/food-categories.service';
import { Notification } from '../shared/interfaces/order.interface';

/** Most top-level categories the bar will ever show inline; width trims this further. */
const MAX_INLINE_CATEGORIES = 7;

/**
 * How many category labels fit beside the brand, search and actions on one row, measured
 * against Armenian, the longest of the three locales. Whatever does not fit moves into the
 * overflow menu, so the two sets never repeat each other.
 */
const INLINE_BREAKPOINTS: readonly { readonly minWidth: number; readonly count: number }[] = [
  { minWidth: 1728, count: 5 },
  { minWidth: 1440, count: 4 },
  { minWidth: 1280, count: 3 },
  { minWidth: 0, count: 2 },
];

const inlineCountFor = (width: number): number =>
  INLINE_BREAKPOINTS.find((b) => width >= b.minWidth)!.count;

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
  /** Categories the bar has room for at the current width. */
  inlineCategories = computed(() =>
    this.categories().slice(0, inlineCountFor(this.viewportWidth()))
  );
  /** The rest, offered through the overflow menu; empty once everything fits. */
  overflowCategories = computed(() =>
    this.categories().slice(inlineCountFor(this.viewportWidth()))
  );
  searchTerm = '';

  @Output() sidenavStatus = new EventEmitter<boolean>();

  private isOpenedSidenav = false;
  private viewportWidth = signal(window.innerWidth);
  private destroyRef = inject(DestroyRef);
  private fAuth = inject(AuthService);
  private basketService = inject(BasketService);
  private ordersService = inject(NotificationsService);
  private foodCategories = inject(FoodCategoriesService);
  private router = inject(Router);

  constructor() {
    this.user = this.fAuth.currentUser;
    this.basket = this.basketService.basket;
    const trackWidth = () => this.viewportWidth.set(window.innerWidth);
    window.addEventListener('resize', trackWidth);
    this.destroyRef.onDestroy(() => window.removeEventListener('resize', trackWidth));
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
