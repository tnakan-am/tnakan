import { Injectable, signal, WritableSignal } from '@angular/core';
import { Product } from '../interfaces/product.interface';

export interface Order extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  basket: WritableSignal<Order[]> = signal([]);

  constructor() {}

  addToBasket(product: Order) {
    this.basket.update((value) => {
      value.push(product);
      return value;
    });
  }
}
