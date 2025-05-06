import { Component, OnInit } from '@angular/core';
import { CardItemComponent } from './components/card-item/card-item.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Product } from '../shared/interfaces/product.interface';
import { ProductsService } from '../shared/services/products.service';
import { BasketService } from '../shared/services/basket.service';
import { Status } from '../shared/interfaces/order.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CardItemComponent, AsyncPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  products$!: Observable<Product[]>;

  constructor(
    private productsService: ProductsService,
    private basketService: BasketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProductData();

    this.route?.queryParams?.subscribe((params) => {
      if (params['subCategory'] || params['productCategory'] || params['category']) {
        this.products$ = this.productsService.getAllProductsByQuery(params);
      } else {
        this.getProductData();
      }
    });
  }

  private getProductData(): void {
    this.products$ = this.productsService.getAllProducts();
  }

  addToBasket(product: Product) {
    this.basketService.addToBasket({
      ...product,
      quantity: product.minQuantity,
      status: Status.pending,
    });
  }
}
