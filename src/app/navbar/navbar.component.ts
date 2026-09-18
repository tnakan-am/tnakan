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
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatBadge } from '@angular/material/badge';
import { AuthService } from '../shared/services/auth.service';
import { BasketService } from '../shared/services/basket.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { FoodCategoriesService } from '../shared/services/food-categories.service';
import { Notification } from '../shared/interfaces/order.interface';

/** Below this the row has no room for categories at all and the drawer carries them. */
const CATEGORY_BAR_MIN_WIDTH = 1024;

/**
 * How many category labels fit beside the brand, search and actions on one row, measured
 * against Armenian, the longest of the three locales. Whatever does not fit is reached
 * through the drawer, which always lists the whole tree. Re-measure these if the labels
 * or the surrounding controls change; a label that no longer fits ellipsizes rather than
 * widening the row.
 */
const INLINE_BREAKPOINTS: readonly { readonly minWidth: number; readonly count: number }[] = [
  { minWidth: 1440, count: 5 },
  { minWidth: 1380, count: 4 },
  { minWidth: 1200, count: 3 },
  { minWidth: CATEGORY_BAR_MIN_WIDTH, count: 2 },
  { minWidth: 0, count: 0 },
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
  categories = computed(() => this.foodCategories.tree());
  /** Categories the bar has room for at the current width. */
  inlineCategories = computed(() =>
    this.categories().slice(0, inlineCountFor(this.viewportWidth()))
  );
  /** The drawer is offered exactly when the bar cannot show every category. */
  showDrawerToggle = computed(() => this.inlineCategories().length < this.categories().length);
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
    // Widening the window until every category fits retires the toggle, so the drawer it
    // opened must not be left hanging over the page with no control to close it.
    effect(() => {
      if (!this.showDrawerToggle() && this.isOpenedSidenav) {
        this.isOpenedSidenav = false;
        this.sidenavStatus.emit(false);
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
