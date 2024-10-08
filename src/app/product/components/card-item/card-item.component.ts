import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { NgxStarsModule } from 'ngx-stars';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../../interfaces/product.interface';
import { UnitTypeEnum } from '../../common/enums/unit.enum';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle,
    MatIcon,
    NgxStarsModule,
    DecimalPipe,
  ],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss',
})
export class CardItemComponent {
  @Input() product!: Product;
  @Output() addToCard = new EventEmitter<Product>();
  units = UnitTypeEnum;

  handleAddToCard(event: Product) {
    this.addToCard.emit(event);
  }
}
