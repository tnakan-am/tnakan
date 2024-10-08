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

import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { openSnackBar } from '../helpers/snackbar';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  auth: Auth = inject(Auth);
  router: Router = inject(Router);
  firestore: Firestore = inject(Firestore);
  user$: Observable<User> = user(this.auth);
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
        this.router.navigate(['/']); // Navigate to home or dashboard
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
        await this.saveUserDataOnSignUp(data); // Save user data to Firestore
        this.router.navigate(['/']); // Navigate to home or dashboard
      } catch (error) {
        this.snackBar((error as any).customData._tokenResponse.error.message);
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
}
