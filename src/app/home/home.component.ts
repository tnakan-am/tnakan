import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductComponent } from './product/product.component';
import { FirebaseAuthService } from '../shared/services/firebase-auth.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatToolbar,
    RouterLink,
    MatMenuTrigger,
    ProductComponent,
    TranslateModule,
    AsyncPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  title = 'tnakan';
  user$: Observable<User | null>;

  constructor(private translateService: TranslateService, private fAuth: FirebaseAuthService) {
    this.user$ = fAuth.user$;
  }

  changeLanguage(lang: string) {
    this.translateService.setDefaultLang(lang);
  }

  logout() {
    this.fAuth.logout();
  }
}
