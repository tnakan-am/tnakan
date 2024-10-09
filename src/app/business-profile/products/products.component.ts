import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from './add-product/add-product.component';
import { CategoryTree } from '../../interfaces/categories.interface';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';
import { map, Observable, of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { User } from '@angular/fire/auth';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatButton,
    AsyncPipe,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatIcon,
    MatIconButton,
    TranslateModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  @Input() user!: User;
  products$!: Observable<Product[]>;
  displayedColumns: string[] = ['ID', 'name', 'description', 'unit', 'price', 'star'];
  private categories!: CategoryTree[];

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.products$ = this.productsService.getUserProducts();
  }

  openDialog(form?: Product): void {
    (this.categories?.length ? of(this.categories) : this.categoriesService.getCategoriesTree())
      .pipe(
        switchMap((value) => {
          this.categories = value || [];
          const dialogRef = this.dialog.open(AddProductComponent, {
            data: { name: 'product', categories: value, form },
            width: '500px',
          });
          return dialogRef.afterClosed() as Observable<Product>;
        }),
        switchMap((value: Product) => {
          if (value !== undefined) {
            return (
              form
                ? this.productsService.updateProduct(value, form.id!)
                : this.productsService.createProduct({
                    ...value,
                    userId: this.user.uid,
                    userDisplayName: this.user.displayName!,
                    userPhoto: this.user.photoURL,
                  })
            ).pipe(map(() => true));
          }
          return of(false);
        })
      )
      .subscribe({
        next: (value) => {
          if (value) this.products$ = this.productsService.getUserProducts();
        },
      });
  }

  delete(element: any) {
    this.productsService.deleteProduct(element.id).subscribe({
      next: (value) => (this.products$ = this.productsService.getUserProducts()),
    });
  }

  edite(element: any) {
    this.openDialog(element);
  }
}
