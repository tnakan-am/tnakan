import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../shared/services/users.service';
import { Observable } from 'rxjs';
import { IUser } from '../shared/interfaces/user.interface';
import { AsyncPipe } from '@angular/common';
import { CardItemComponent } from '../product/components/card-item/card-item.component';
import { ProductsService } from '../shared/services/products.service';
import { Product } from '../shared/interfaces/product.interface';
import { Status } from '../shared/interfaces/order.interface';
import { BasketService } from '../shared/services/basket.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-seller-page',
  standalone: true,
  imports: [AsyncPipe, CardItemComponent, TranslateModule],
  templateUrl: './seller-page.component.html',
  styleUrl: './seller-page.component.scss',
})
export class SellerPageComponent implements OnInit {
  userService = inject(UsersService);
  productsService = inject(ProductsService);
  basketService = inject(BasketService);
  user$!: Observable<IUser>;
  products$!: Observable<Product[]>;
  private id: string;

  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
    this.products$ = this.productsService.getAllProductsBySeller(this.id);
  }

  ngOnInit() {
    this.user$ = this.userService.getUserById(this.id);
  }

  addToBasket(product: Product) {
    this.basketService.addToBasket({
      ...product,
      quantity: product.minQuantity,
      status: Status.pending,
    });
  }
}
