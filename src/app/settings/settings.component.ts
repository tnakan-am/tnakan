import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { Observable, switchMap, tap } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { UsersService } from '../services/users.service';
import { IUser } from '../interfaces/user.interface';
import { ProductsService } from '../services/products.service';
import { openSnackBar } from '../helpers/snackbar';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [AsyncPipe, MatIcon],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private firebaseAuthService = inject(FirebaseAuthService);
  private usersService = inject(UsersService);
  readonly productsService = inject(ProductsService);
  readonly storageService = inject(StorageService);

  user$!: Observable<User>;
  userData$!: Observable<IUser | undefined>;
  private user!: User;
  openSnackBar = openSnackBar();

  constructor() {
    this.user$ = this.firebaseAuthService.user$.pipe(tap((value) => (this.user = value)));
    this.userData$ = this.usersService.getUserData();
  }

  uploadFile(event: any) {
    const file = event?.target?.files?.[0];

    if (!file || !this.user.uid) return;

    this.storageService.uploadFile(file, this.user.uid).subscribe({
      next: async (value) => {
        this.usersService
          .update(this.user, { image: value })
          .pipe(
            switchMap(() => {
              return this.productsService.batchUpdateProductsByUserId(
                { userPhoto: value },
                this.user.uid
              );
            })
          )
          .subscribe({
            next: (value) => {
              this.openSnackBar('Successfully uploaded!');
            },
          });
      },
    });
  }
}
