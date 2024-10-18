import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  basket: WritableSignal<OrderItem[]> = signal([]);
  cities: WritableSignal<{ city: string; admin_name: string }[]> = signal([]);
  regions: WritableSignal<string[]> = signal([]);

  constructor(private http: HttpClient) {
    this.getCitiesRegions().subscribe({
      next: (value) => {
        this.cities.set(value);
        this.regions.set(Array.from(new Set(value.map((value1) => value1.admin_name))));
      },
    });
  }

  addToBasket(order: OrderItem) {
    this.basket.update((value) => {
      if (!value.find((value1) => value1.id === order.id)) {
        value.push(order);
      }
      return value;
    });
  }

  getCitiesRegions(): Observable<{ city: string; admin_name: string }[]> {
    return this.http.get<{ city: string; admin_name: string }[]>('assets/am.json');
  }
}
