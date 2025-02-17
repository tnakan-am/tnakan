import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
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
import { map, Observable, of, switchMap } from 'rxjs';
import { Product } from '../../shared/interfaces/product.interface';
import { CategoryTree } from '../../shared/interfaces/categories.interface';
import { FirebaseAuthService } from '../../shared/services/firebase-auth.service';
import { User } from '@angular/fire/auth';
import { CategoriesService } from '../../shared/services/categories.service';
import { ProductsService } from '../../shared/services/products.service';
import { ReviewService } from '../../shared/services/review.service';
import { AddProductComponent } from '../../business-profile/products/add-product/add-product.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-products-approve',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatTable,
    SlicePipe,
    TranslateModule,
    MatHeaderCellDef,
  ],
  templateUrl: './products-approve.component.html',
  styleUrl: './products-approve.component.scss',
})
export class ProductsApproveComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  products$!: Observable<Product[]>;
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
    private productsService: ProductsService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.firebaseAuthService.user$.pipe().subscribe((value) => (this.user = value));
    this.products$ = this.productsService.getAllUnapprovedProducts();
  }

  private updateProductStatus(value: Product, id: string) {
    return this.productsService.approveOrBlockProduct(
      {
        ...value,
        approved: !value.approved,
      },
      id
    );
  }

  openDialog(form?: Product): void {
    (this.categories?.length ? of(this.categories) : this.categoriesService.getCategoriesTree())
      .pipe(
        switchMap((value) => {
          this.categories = value || [];
          const dialogRef = this.dialog.open(AddProductComponent, {
            data: { name: 'product', categories: value, form, userId: this.user.uid, admin: true },
            width: '500px',
          });
          return dialogRef.afterClosed() as Observable<Product>;
        }),
        switchMap((value: Product) => {
          if (value) {
            return this.updateProductStatus(value, form!.id).pipe(map(() => true));
          }
          return of(false);
        })
      )
      .subscribe({
        next: (value) => {
          if (value) this.products$ = this.productsService.getAllUnapprovedProducts();
        },
      });
  }

  delete(element: Product) {
    this.productsService.deleteProduct(element.id!).subscribe({
      next: (value) => (this.products$ = this.productsService.getUserProducts()),
    });
  }
}
