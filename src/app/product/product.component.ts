import { Component, OnInit } from '@angular/core';
import { CardItemComponent } from './components/card-item/card-item.component';
import { ProductsService } from '../services/products.service';
import { Product } from '../interfaces/product.interface';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CardItemComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  productList!: Product[];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.getProductData();
  }

  private getProductData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.productList = data;
      },
      error: (error) => {},
    });
  }
}
