import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { UsersService } from '../services/users.service';
import { MatBadge } from '@angular/material/badge';
import { BasketService } from '../services/basket.service';

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
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  user$: Observable<IUser | undefined>;
  basket;

  constructor(
    private translateService: TranslateService,
    private fAuth: FirebaseAuthService,
    private usersService: UsersService,
    private basketService: BasketService
  ) {
    this.basket = basketService.basket;
    if (localStorage.getItem('lang')) {
      translateService.setDefaultLang(localStorage.getItem('lang') as string);
    } else {
      translateService.setDefaultLang('hy');
    }
    this.user$ = this.usersService.getUserData();
  }

  changeLanguage(lang: string) {
    this.translateService.setDefaultLang(lang);
    localStorage.setItem('lang', lang);
  }

  logout() {
    this.fAuth.logout();
  }
}
