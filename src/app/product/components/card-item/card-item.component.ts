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
import { MatTooltip } from '@angular/material/tooltip';
import { UnitTypeEnum } from '../../../shared/enums/unit.enum';
import { ActivatedRoute, Router } from '@angular/router';

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
  units = UnitTypeEnum;
  @Input() product!: Product;
  @Output() addToCard = new EventEmitter<Product>();

  constructor(private router: Router, private activatedRouter: ActivatedRoute) {}

  handleAddToCard(event: Product) {
    this.addToCard.emit(event);
  }

  navigateToProduct(product: Product) {
    this.router.navigate(['product', product.id], { relativeTo: this.activatedRouter });
  }
}
