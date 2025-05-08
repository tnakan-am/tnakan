import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductComponent } from '../product/product.component';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from '../shared/services/firebase-auth.service';
import { CarouselComponent } from './carousel/carousel.component';
import { AdvertisementCarouselComponent } from './advertisement-carousel/advertisement-carousel.component';
import { CarouselItem } from '../shared/interfaces/carusel-item.interface';

@Component({
  selector: 'app-home',
  imports: [ProductComponent, TranslateModule, CarouselComponent, AdvertisementCarouselComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  title = 'tnakan';
  user$: Observable<User | null>;
  // parent.component.ts
  ads: CarouselItem[] = [
    {
      image: 'https://random-image-pepebigotes.vercel.app/api/random-image',
      headline: '$599.99 or pay over time',
      subheadline: 'eero Max 7 • Wi‑Fi 7 whole‑home mesh',
      cta: 'Shop now',
      link: '/eero-max-7',
    },
    {
      image: 'https://random-image-pepebigotes.vercel.app/api/random-image',
      headline: 'Fire HD 10 – 20 % faster',
      subheadline: 'Power through the day on a single charge.',
      cta: 'Learn more',
      link: '/fire-hd-10',
    },
    // …
  ];

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
