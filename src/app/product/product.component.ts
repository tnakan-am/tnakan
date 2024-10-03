import { Component, OnInit } from '@angular/core';
import { CardItemComponent } from './components/card-item/card-item.component';
import { ProductItemInterface } from './common/interfaces/product-item.interface';
import { ProductHttpService } from './common/services/product-http.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CardItemComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  productList: ProductItemInterface[];

  constructor(private productHttpService: ProductHttpService) {
  }

   ngOnInit(): void {
    this.getProductData();
   }

   private getProductData(): void {
    this.productHttpService.getProductList()
      .subscribe({
        next: data => {
          this.productList = data
        },
        error: error => {},
      })
   }
}
