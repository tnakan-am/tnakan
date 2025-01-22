import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardImage } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { NgxStarsModule } from 'ngx-stars';
import { DecimalPipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Unit } from '../../../shared/enums/unit.enum';
import { Product } from '../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardImage,
    MatIcon,
    NgxStarsModule,
    DecimalPipe,
    MatTooltip,
  ],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss',
})
export class CardItemComponent {
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
