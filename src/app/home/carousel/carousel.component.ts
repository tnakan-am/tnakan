import { Component, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { NgxStarsModule } from 'ngx-stars';
import { UsersService } from '../../shared/services/users.service';
import { Type } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, NgxStarsModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements OnInit {
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

  carouselData: {
    text: string;
    avgReview: number;
    sellerUrl: string;
    src: string;
  }[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getUsersList();
  }

  private getUsersList(): void {
    this.usersService.getUsersList().subscribe((users) => {
      console.log(users);
      this.carouselData = users
        .filter((user) => user.isTopSeller && user.type === Type.BUSINESS)
        .map((user) => {
          return {
            text: user.name || '',
            avgReview: 5,
            sellerUrl: `seller/${user.uid}`,
            src: user.image || 'https://random-image-pepebigotes.vercel.app/api/random-image',
          };
        });
    });
  }
}
