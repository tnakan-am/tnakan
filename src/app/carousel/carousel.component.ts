import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { NgxStarsModule } from 'ngx-stars';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, NgxStarsModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent {
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

  carouselData = [
    {
      text: 'Vahe',
      avgReview: 5,
      sellerUrl: 'seller/grJLCXq6Bfb5FzZnETRshPARsmL2',
      src: 'https://random-image-pepebigotes.vercel.app/api/random-image',
    },
    {
      text: 'Gexam Tnakan Arax',
      avgReview: 5,
      sellerUrl: 'seller/grJLCXq6Bfb5FzZnETRshPARsmL2',
      src: 'https://random-image-pepebigotes.vercel.app/api/random-image',
    },
    {
      text: 'Anna',
      avgReview: 5,
      sellerUrl: 'seller/grJLCXq6Bfb5FzZnETRshPARsmL2',
      src: 'https://random-image-pepebigotes.vercel.app/api/random-image',
    },
    {
      text: 'Laura Tota',
      avgReview: 5,
      sellerUrl: 'seller/grJLCXq6Bfb5FzZnETRshPARsmL2',
      src: 'https://random-image-pepebigotes.vercel.app/api/random-image',
    },
    {
      text: 'Hamov Torter',
      avgReview: 5,
      sellerUrl: 'seller/grJLCXq6Bfb5FzZnETRshPARsmL2',
      src: 'https://random-image-pepebigotes.vercel.app/api/random-image',
    },
  ];
}
