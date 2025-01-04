import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTab, MatTabChangeEvent, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { ReviewComponent } from '../reviews/review.component';
import { Review } from '../../../shared/interfaces/reviews.interface';
import { Product } from '../../../shared/interfaces/product.interface';
import { BasketService } from '../../../shared/services/basket.service';
import { ProductsService } from '../../../shared/services/products.service';
import { Status } from '../../../shared/interfaces/order.interface';
import { ReviewService } from '../../../shared/services/review.service';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, MatTabGroup, MatTab, ReviewComponent, MatTabContent, RouterLink],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent implements OnInit {
  product?: Product;
  reviewsList!: Review[];
  private productId: string = '';
  private basketService = inject(BasketService);
  private reviewService = inject(ReviewService);

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
      console.log(this.product);
    });
  }

  handleTabChange(event: MatTabChangeEvent) {
    if (event.index === 1) {
      if (this.product) {
        this.reviewService.getProductReview(this.product).subscribe((review) => {
          this.reviewsList = review;
        });
      }
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
