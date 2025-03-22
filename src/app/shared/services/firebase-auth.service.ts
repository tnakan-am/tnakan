import { inject, Injectable } from '@angular/core';
import {
  Auth,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
  User,
} from '@angular/fire/auth';

import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/user.interface';
import { Observable, shareReplay, filter } from 'rxjs';
import { openSnackBar } from '../helpers/snackbar';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  auth: Auth = inject(Auth);
  router: Router = inject(Router);
  firestore: Firestore = inject(Firestore);
  usersService: UsersService = inject(UsersService);
  user$: Observable<User> = user(this.auth).pipe(
    filter((user: User | null): user is User => user !== null),
    shareReplay(1)
  );
  private snackBar = openSnackBar();

  constructor() {
    this.auth.setPersistence(browserLocalPersistence).then();
  }

  getFirebaseUser(): User | null {
    return this.auth.currentUser;
  }

  async login(email: string, password: string) {
    try {
      const userCred = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCred.user;
      if (user) {
        if (!user.emailVerified) {
          this.snackBar('please verify your email');
        } else {
          this.router.navigate(['/']); // Navigate to home or dashboard
        }
      }
    } catch (error) {
      this.snackBar((error as any)?.message as string);
      return;
    }
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        this.router.navigate(['/', 'login']);
      })
      .catch((error) => {
        console.log('sign out error: ' + error);
      });
  }

  async signUp(formData: IUser) {
    const { email, password, displayName, phoneNumber } = formData;
    let user;
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password!);
      user = userCredential.user;
    } catch (error) {
      this.snackBar((error as any).customData._tokenResponse.error.message);
      return;
    }
    if (user) {
      try {
        const data = { ...user, ...formData };
        await this.usersService.saveUserDataOnSignUp(data); // Save user data to Firestore
      } catch (error) {
        this.snackBar((error as any).customData._tokenResponse.error.message);
        return;
      }
    }
    try {
      await updateProfile(user, {
        displayName,
        photoURL: formData?.image,
      });
      await sendEmailVerification(user);
    } catch (error) {
      this.snackBar((error as any).customData._tokenResponse.error.message);
      return;
    }
    this.snackBar('Registration successfully done, please verify your email');

    await signOut(this.auth);

    return this.router.navigate(['/confirm-email']);
  }
}
