import { Component, EventEmitter, Output, signal, WritableSignal, effect } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../shared/services/auth.service';
import { MatBadge } from '@angular/material/badge';
import { BasketService } from '../shared/services/basket.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { Notification } from '../shared/interfaces/order.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatToolbar,
    RouterLink,
    TranslateModule,
    MatMenuTrigger,
    MatBadge,
    MatIconAnchor,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  user;
  basket;
  isOpenedSidenav = true;
  isRotated = false;
  notifications?: WritableSignal<Notification[]>;

  @Output() sidenavStatus = new EventEmitter<boolean>();

  constructor(
    private translateService: TranslateService,
    private fAuth: AuthService,
    private basketService: BasketService,
    private ordersService: NotificationsService,
    private router: Router
  ) {
    this.user = this.fAuth.currentUser;
    this.basket = this.basketService.basket;
    if (localStorage.getItem('lang')) {
      translateService.setDefaultLang(localStorage.getItem('lang') as string);
    } else {
      translateService.setDefaultLang('hy');
    }
    effect(() => {
      if (this.user()?.type === 'business' && !this.notifications) {
        this.businessUserNotificationsSubscription();
      }
    });
  }

  changeLanguage(lang: string) {
    this.translateService.setDefaultLang(lang);
    localStorage.setItem('lang', lang);
  }

  logout() {
    this.fAuth.logout();
  }

  redirectToOrders() {
    const user = this.user();
    if (!user) return;
    this.router.navigate(['/profile', user.type, 'orders']);
  }

  businessUserNotificationsSubscription() {
    this.ordersService.onValue(() => {});
    this.notifications = this.ordersService.newOrders;
  }

  toggleSidebar(): void {
    this.isOpenedSidenav = !this.isOpenedSidenav;
    this.sidenavStatus.emit(this.isOpenedSidenav);
    this.isRotated = !this.isRotated;
  }
}
