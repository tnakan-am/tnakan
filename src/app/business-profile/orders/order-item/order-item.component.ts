import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { OrderItem } from '../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [MatCard, MatCardContent],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderItemComponent {
  @Input() set product(val: OrderItem) {
    this._product = val;
  }

  get product(): OrderItem {
    return this._product;
  }

  private _product!: OrderItem;
}
