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
import { Product } from '../../../../shared/interfaces/product.interface';
import { Unit } from '../../common/enums/unit.enum';
import { MatTooltip } from '@angular/material/tooltip';

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
    MatTooltip,
  ],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss',
})
export class CardItemComponent {
  @Input() product!: Product;
  @Output() addToCard = new EventEmitter<Product>();
  units = Unit;

  handleAddToCard(event: Product) {
    this.addToCard.emit(event);
  }
}
