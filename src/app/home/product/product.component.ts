import { Component, OnInit } from '@angular/core';
import { CardItemComponent } from './components/card-item/card-item.component';
import { ProductsService } from '../../shared/services/products.service';
import { Product } from '../../shared/interfaces/product.interface';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BasketService } from '../../shared/services/basket.service';
import { Status } from '../../shared/interfaces/order.interface';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CardItemComponent, AsyncPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  products$!: Observable<Product[]>;

  constructor(private productsService: ProductsService, private basketService: BasketService) {}

  ngOnInit(): void {
    this.getProductData();
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
