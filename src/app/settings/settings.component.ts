import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../shared/services/firebase-auth.service';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { UsersService } from '../shared/services/users.service';
import { IUser } from '../shared/interfaces/user.interface';
import { ProductsService } from '../shared/services/products.service';
import { openSnackBar } from '../shared/helpers/snackbar';
import { StorageService } from '../shared/services/storage.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditeAddressComponent } from './edite-address/edite-address.component';
import { EditeProfileComponent } from './edite-profile/edite-profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { UpdatePasswordComponent } from './update-password/update-password.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [AsyncPipe, MatIcon, MatIconButton, MatButton, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private firebaseAuthService = inject(FirebaseAuthService);
  private usersService = inject(UsersService);
  readonly productsService = inject(ProductsService);
  readonly storageService = inject(StorageService);
  readonly dialog = inject(MatDialog);

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

  editeAddress(user: IUser) {
    const dialogRef = this.dialog.open(EditeAddressComponent, {
      data: { ...user },
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((value) => !!value))
      .subscribe((result) => {
        this.usersService.update(this.user, { address: result }).subscribe({
          next: () => {
            this.userData$ = this.usersService.getUserData();
          },
        });
      });
  }

  editeProfile(user: IUser) {
    const dialogRef = this.dialog.open(EditeProfileComponent, {
      data: { ...user },
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((value) => !!value))
      .subscribe((result) => {
        this.usersService.update(this.user, result).subscribe({
          next: () => {
            this.userData$ = this.usersService.getUserData();
          },
        });
      });
  }

  openUpdatePassword(user: IUser) {
    const dialogRef = this.dialog.open(UpdatePasswordComponent, {
      data: { ...user },
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((value) => value.password && value.password === value.rePassword))
      .subscribe((result) => {
        this.usersService.updatePassword(this.user, result.password);
      });
  }
}
