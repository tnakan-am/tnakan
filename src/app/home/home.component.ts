import { Component, inject, Signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProductComponent } from '../product/product.component';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { CarouselComponent } from './carousel/carousel.component';
import { AdvertisementCarouselComponent } from './advertisement-carousel/advertisement-carousel.component';
import { CarouselItem } from '../shared/interfaces/carusel-item.interface';
import { UsersService } from '../shared/services/users.service';
import { AdsService } from '../shared/services/ads.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  imports: [ProductComponent, TranslateModule, CarouselComponent, AdvertisementCarouselComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly usersService = inject(UsersService);
  private readonly adsService = inject(AdsService);
  title = 'tnakan';
  ads: Signal<CarouselItem[]>;

  constructor() {
    this.ads = toSignal(
      this.adsService.getApproved().pipe(
        map((ads) =>
          ads.map((ad): CarouselItem => ({
            image: ad.image,
            headline: ad.headline,
            subheadline: ad.subheadline ?? undefined,
            cta: ad.cta ?? undefined,
            link: ad.link ?? undefined,
          }))
        ),
        catchError(() => of([] as CarouselItem[])),
        switchMap((items) => (items.length ? of(items) : this.businessSlides()))
      ),
      { initialValue: [] }
    );
  }

  /** Fallback hero content while no ads are approved. */
  private businessSlides(): Observable<CarouselItem[]> {
    return this.usersService.getBusinesses().pipe(
      map(
        (value) =>
          value.map((value1) => ({
            image: value1.image,
            headline: value1.displayName,
            subheadline: value1.company || value1.name,
            cta: 'Shop now',
            link: `/seller/${value1.id}`,
          })) as CarouselItem[]
      ),
      catchError(() => of([] as CarouselItem[]))
    );
  }
}
