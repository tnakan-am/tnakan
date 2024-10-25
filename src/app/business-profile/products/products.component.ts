import { Component, inject, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from './add-product/add-product.component';
import { CategoryTree } from '../../shared/interfaces/categories.interface';
import { CategoriesService } from '../../shared/services/categories.service';
import { ProductsService } from '../../shared/services/products.service';
import { Product } from '../../shared/interfaces/product.interface';
import { map, Observable, of, switchMap } from 'rxjs';
import { AsyncPipe, SlicePipe } from '@angular/common';
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
import { FirebaseAuthService } from '../../shared/services/firebase-auth.service';

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
    SlicePipe,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  products$: Observable<Product[]>;
  displayedColumns: string[] = [
    'ID',
    'name',
    'description',
    'unit',
    'price',
    'availability',
    'star',
  ];
  private categories!: CategoryTree[];
  private firebaseAuthService = inject(FirebaseAuthService);
  private user!: User;

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ) {
    this.firebaseAuthService.user$.pipe().subscribe((value) => (this.user = value));
    this.products$ = this.productsService.getUserProducts();
  }

  ngOnInit() {}

  openDialog(form?: Product): void {
    (this.categories?.length ? of(this.categories) : this.categoriesService.getCategoriesTree())
      .pipe(
        switchMap((value) => {
          this.categories = value || [];
          const dialogRef = this.dialog.open(AddProductComponent, {
            data: { name: 'product', categories: value, form, userId: this.user.uid },
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

  delete(element: Product) {
    this.productsService.deleteProduct(element.id!).subscribe({
      next: (value) => (this.products$ = this.productsService.getUserProducts()),
    });
  }

  edite(element: Product) {
    this.openDialog(element);
  }
}
