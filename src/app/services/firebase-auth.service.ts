import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  User,
  authState,
  user,
} from '@angular/fire/auth';

import { doc, Firestore, setDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/user.interface';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  auth: Auth = inject(Auth);
  router: Router = inject(Router);
  firestore: Firestore = inject(Firestore);
  user$ = user(this.auth);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBar: MatSnackBar) {}

  getFirebaseUser(): User | null {
    return this.auth.currentUser;
  }

  async login(email: string, password: string) {
    try {
      const userCred = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCred.user;
      if (user) {
        await this.saveUserData(user); // Store user data in Firestore
        localStorage.setItem('firebaseToken', await user.getIdToken());
        this.router.navigate(['/']); // Navigate to home or dashboard
      }
    } catch (error) {
      this.openSnackBar((error as any).customData._tokenResponse.error.message);
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
      const idToken = await user.getIdToken();
      localStorage.setItem('firebaseToken', idToken);
    } catch (error) {
      this.openSnackBar((error as any).customData._tokenResponse.error.message);
      return;
    }
    if (user) {
      try {
        const data = { ...user, ...formData };
        await this.saveUserDataOnSignUp(data); // Save user data to Firestore
        localStorage.setItem('firebaseToken', await user.getIdToken());
        this.router.navigate(['/']); // Navigate to home or dashboard
      } catch (error) {
        this.openSnackBar((error as any).customData._tokenResponse.error.message);
        return;
      }
    }
    await updateProfile(user, {
      displayName,
    });
    await sendEmailVerification(user);
    this.router.navigate(['/']);
  }
  // Save user data to Firestore
  private async saveUserDataOnSignUp(user: IUser): Promise<void> {
    const userRef = doc(collection(this.firestore, 'users'), user.uid);
    const userData = {
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      type: user.type,
    };
    await setDoc(userRef, userData, { merge: true });
  }
  // Save user data to Firestore
  private async saveUserData(user: User): Promise<void> {
    const userRef = doc(collection(this.firestore, 'users'), user.uid);
    const userData = {
      email: user.email,
      displayName: user.displayName,
    };
    await setDoc(userRef, userData, { merge: true });
  }

  private openSnackBar(error: string) {
    this._snackBar.open(error, undefined, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000,
    });
  }
}
