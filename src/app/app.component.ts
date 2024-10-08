import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from './footer/footer.component';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { UsersService } from './services/users.service';
import { IUser } from './interfaces/user.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    RouterLink,
    FooterComponent,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'tnakan';
  user$: Observable<IUser | undefined>;

  constructor(
    private translateService: TranslateService,
    private fAuth: FirebaseAuthService,
    private usersService: UsersService
  ) {
    translateService.setDefaultLang('en');
    this.user$ = this.usersService.getUserData();
  }

  changeLanguage(lang: string) {
    this.translateService.setDefaultLang(lang);
  }

  logout() {
    this.fAuth.logout();
  }
}
