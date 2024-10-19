import { Component, OnInit } from '@angular/core';
import { CardItemComponent } from './components/card-item/card-item.component';
import { ProductsService } from '../services/products.service';
import { Product } from '../interfaces/product.interface';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BasketService } from '../services/basket.service';

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
    });
  }
}
