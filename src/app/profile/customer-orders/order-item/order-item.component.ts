import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { OrderItem } from '../../../shared/interfaces/order.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StarInputComponent } from '../../../shared/star-input/star-input.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { ReviewService } from '../../../shared/services/review.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    StarInputComponent,
    MatFormField,
    MatInput,
    MatLabel,
    TranslateModule,
    MatButton,
  ],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderItemComponent implements OnInit {
  form = new FormGroup({
    comment: new FormControl(''),
    stars: new FormControl('', Validators.required),
  });
  reviewService = inject(ReviewService);
  bill!: number;

  @Input() set product(val: OrderItem) {
    this._product = val;
    this.bill = this._product.price * this._product.quantity;
  }
  @Output() onRate = new EventEmitter();

  ngOnInit() {
    this.reviewService
      .getProductReview(this._product, this._product.orderId)
      .pipe(
        filter((review) => !!review.length),
        map((value) => value[0])
      )
      .subscribe({
        next: (value) => {
          this.form.patchValue(value);
          this.form.disable({ onlySelf: true, emitEvent: false });
        },
      });
  }

  get product(): OrderItem {
    return this._product;
  }
  private _product!: OrderItem;

  rateProduct() {
    this.reviewService
      .writeReview(this.product, this.form.value as unknown as { stars: number; comment: string })
      .subscribe({
        next: (value) => {
          this.form.disable({ onlySelf: true, emitEvent: false });
        },
      });
  }
}
