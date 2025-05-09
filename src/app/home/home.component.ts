import { Component, inject, Signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProductComponent } from '../product/product.component';
import { map } from 'rxjs';
import { CarouselComponent } from './carousel/carousel.component';
import { AdvertisementCarouselComponent } from './advertisement-carousel/advertisement-carousel.component';
import { CarouselItem } from '../shared/interfaces/carusel-item.interface';
import { UsersService } from '../shared/services/users.service';
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
  title = 'tnakan';
  ads: Signal<CarouselItem[]>;

  constructor() {
    this.ads = toSignal(
      this.usersService.getBusinesses().pipe(
        map(
          (value) =>
            value.map((value1) => ({
              image: value1.image,
              headline: value1.displayName,
              subheadline: value1.name,
              cta: 'Shop now',
              link: `/seller/${value1.uid}`,
            })) as CarouselItem[]
        )
      ),
      { initialValue: [] }
    );
  }
}
