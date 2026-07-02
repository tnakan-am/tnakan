import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardImage } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { NgxStarsModule } from 'ngx-stars';
import { DecimalPipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Unit } from '../../../shared/enums/unit.enum';
import { Product } from '../../../shared/interfaces/product.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { STAR_COLOR } from '../../../shared/constants/theme';

@Component({
  selector: 'app-card-item',
  imports: [
    MatIconButton,
    MatCard,
    MatCardContent,
    MatCardImage,
    MatIcon,
    NgxStarsModule,
    DecimalPipe,
    MatTooltip,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss',
})
export class CardItemComponent {
  readonly starColor = STAR_COLOR;
  units = Unit;
  @Input() product!: Product;
  @Output() addToCard = new EventEmitter<Product>();

  constructor(private router: Router, private activatedRouter: ActivatedRoute) {}

  handleAddToCard(event: Product) {
    this.addToCard.emit(event);
  }

  navigateToProduct(product: Product) {
    this.router.navigate(['product', product.id]);
  }
}
