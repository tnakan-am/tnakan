import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { NgxStarsModule } from 'ngx-stars';
import { ProductsService } from '../../shared/services/products.service';
import { ProductCarouselItem } from '../../shared/interfaces/product-carousel-item.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, NgxStarsModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements OnInit {
  private _productsService = inject(ProductsService);
  private readonly baseOptions: OwlOptions = {
    skip_validateItems: true,
    center: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    navSpeed: 400,
    autoplay: true,
    autoplaySpeed: 1000,
    responsiveRefreshRate: 2,
    smartSpeed: 10,
    autoWidth: true,
    autoHeight: true,
  };

  carouselData: Signal<ProductCarouselItem[]>;

  customOptions = computed<OwlOptions>(() => {
    const count = this.carouselData().length;
    // The desktop layout shows up to 4 items, and the library clones up to that
    // many slides per side. Adapt the options to the number of products so the
    // carousel behaves cleanly when data is sparse:
    //  - clamp `items` to the slide count, else the library warns `items > slides`;
    //  - drop `dots`/`nav` unless there are more products than fit, else it warns
    //    `items === slides` and there is nothing to navigate anyway;
    //  - loop only with >= 4 distinct slides, else clones share ids and hit NG0955.
    const clamp = (n: number) => Math.min(n, count || 1);
    return {
      ...this.baseOptions,
      items: clamp(4),
      responsive: {
        0: { items: clamp(1) },
        400: { items: clamp(2) },
        740: { items: clamp(3) },
        940: { items: clamp(4) },
      },
      loop: count >= 4,
      rewind: count < 4,
      dots: count > 4,
      nav: false,
    };
  });

  constructor(private route: ActivatedRoute) {
    this.carouselData = toSignal(
      this.route?.queryParams?.pipe(switchMap((params) => this.getProducts(params))),
      { initialValue: [] }
    );
  }

  ngOnInit() {}

  private getProducts(params?: any) {
    return (
      params && Object.keys(params).length > 0
        ? this._productsService.getAllProductsByQuery(params)
        : this._productsService.getTopProducts()
    ).pipe(
      map((users) =>
        users.map((product) => ({
          text: product.name || '',
          avgReview: product.avgReview,
          url: `product/${product.id}`,
          src: product.image || 'assets/homemade.webp',
        }))
      )
    );
  }
}
