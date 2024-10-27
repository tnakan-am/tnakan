import { Component, inject, OnInit } from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTab, MatTabChangeEvent, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { ReviewsComponent } from '../reviews/reviews.component';
import { Review } from '../../../shared/interfaces/reviews.interface';
import { Product } from '../../../shared/interfaces/product.interface';
import { BasketService } from '../../../shared/services/basket.service';
import { ProductsService } from '../../../shared/services/products.service';
import { Status } from '../../../shared/interfaces/order.interface';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    CommonModule,
    MatList,
    MatListItem,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatIcon,
    MatTabGroup,
    MatTab,
    ReviewsComponent,
    MatTabContent,
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent implements OnInit {
  product!: Product;
  reviewsList: Review[] = [];
  private productId: string = '';
  private basketService = inject(BasketService);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.productId = params['id'];
        this.getProductItem(this.productId);
      }
    });
  }

  getProductItem(productId: string): void {
    this.productsService.getProductById(productId).subscribe((product) => {
      this.product = product;
    });
  }

  handleTabChange(event: MatTabChangeEvent) {
    if (event.index === 1) {
      this.productsService.getProductReviews(this.productId).subscribe((reviews) => {
        this.reviewsList = reviews.reviews_list;
      });
    }
  }

  handleAddToCard(product: Product) {
    this.basketService.addToBasket({
      ...product,
      quantity: product.minQuantity,
      status: Status.pending,
    });
  }
}
