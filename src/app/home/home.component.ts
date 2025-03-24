import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductComponent } from '../product/product.component';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from '../shared/services/firebase-auth.service';
import { CarouselComponent } from './carousel/carousel.component';

@Component({
  selector: 'app-home',
  imports: [ProductComponent, TranslateModule, CarouselComponent],
  standalone: true,
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
