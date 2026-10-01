import { Component, inject } from '@angular/core';
import { filter, Observable, of, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../shared/services/auth.service';
import { UsersService } from '../shared/services/users.service';
import { IUser } from '../shared/interfaces/user.interface';
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
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  readonly storageService = inject(StorageService);
  readonly dialog = inject(MatDialog);

  user$!: Observable<IUser>;
  userData$!: Observable<IUser | undefined>;
  private user!: IUser;
  openSnackBar = openSnackBar();

  constructor() {
    this.user$ = this.authService.user$.pipe(tap((value) => (this.user = value)));
    this.userData$ = this.usersService.getUserData();
  }

  uploadFile(event: any) {
    const file = event?.target?.files?.[0];

    if (!file || !this.user.id) return;

    this.storageService.uploadFile(file, this.user.id).subscribe({
      next: async (value) => {
        this.usersService.update(this.user, { image: value }).subscribe({
          next: () => {
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
      .subscribe(({ email, currentPassword, ...profile }) => {
        // Email has its own endpoint: it needs the current password and
        // resets verification, so it can't go through PATCH /users/me.
        const emailChanged = !!email && email !== user.email;
        const emailChange$: Observable<unknown> = emailChanged
          ? this.usersService.changeEmail(currentPassword, email)
          : of(null);
        emailChange$.pipe(switchMap(() => this.usersService.update(this.user, profile))).subscribe({
          next: () => {
            if (emailChanged) {
              this.openSnackBar('Check your inbox to verify your new email.');
            }
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
      .pipe(
        filter(
          (value) =>
            value?.currentPassword && value?.password && value.password === value.rePassword
        )
      )
      .subscribe((result) => {
        this.usersService.updatePassword(result.currentPassword, result.password).subscribe();
      });
  }
}
