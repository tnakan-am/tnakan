import { Component, WritableSignal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, tap } from 'rxjs';
import { IUser } from '../shared/interfaces/user.interface';
import { FirebaseAuthService } from '../shared/services/firebase-auth.service';
import { UsersService } from '../shared/services/users.service';
import { MatBadge } from '@angular/material/badge';
import { BasketService } from '../shared/services/basket.service';
import { NotificationsService } from '../shared/services/notifications.service';
import { Notification } from '../shared/interfaces/order.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    AsyncPipe,
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
  user$: Observable<IUser | undefined>;
  user: IUser | undefined;
  basket;
  notifications?: WritableSignal<Notification[]>;

  constructor(
    private translateService: TranslateService,
    private fAuth: FirebaseAuthService,
    private usersService: UsersService,
    private basketService: BasketService,
    private ordersService: NotificationsService,
    private router: Router
  ) {
    this.basket = this.basketService.basket;
    if (localStorage.getItem('lang')) {
      translateService.setDefaultLang(localStorage.getItem('lang') as string);
    } else {
      translateService.setDefaultLang('hy');
    }
    this.user$ = this.usersService.getUserData().pipe(
      tap((value) => {
        this.user = value;
        if (this.user?.type === 'business') {
          this.businessUserNotificationsSubscription();
        }
      })
    );
  }

  changeLanguage(lang: string) {
    this.translateService.setDefaultLang(lang);
    localStorage.setItem('lang', lang);
  }

  logout() {
    this.fAuth.logout();
  }

  redirectToOrders() {
    if (!this.user) return;
    this.router.navigate(['/profile', this.user.type, 'orders']);
  }

  businessUserNotificationsSubscription() {
    this.ordersService.onValue(() => {});
    this.notifications = this.ordersService.newOrders;
  }
}
