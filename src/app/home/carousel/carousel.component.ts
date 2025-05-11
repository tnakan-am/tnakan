import { Component, inject, OnInit, Signal } from '@angular/core';
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
  customOptions: OwlOptions = {
    loop: true,
    skip_validateItems: true,
    center: true,
    rewind: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    navSpeed: 400,
    dots: true,
    items: 4,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    autoplay: true,
    autoplaySpeed: 1000,
    responsiveRefreshRate: 2,
    smartSpeed: 10,
    autoWidth: true,
    autoHeight: true,
  };

  carouselData: Signal<ProductCarouselItem[]>;

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
