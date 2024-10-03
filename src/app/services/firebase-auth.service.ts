import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  getAuth,
  authState,
  revokeAccessToken,
  signInWithCustomToken,
} from '@angular/fire/auth';

import {
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  collectionData,
  Timestamp,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  FieldValue,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  auth: Auth = inject(Auth);
  router: Router = inject(Router);
  firestore: Firestore = inject(Firestore);

  constructor() {}

  getFirebaseUser(): any {
    return this.auth.currentUser;
  }

  authState(): Observable<Auth> {
    return authState(this.auth);
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password).then(async (userCred) => {
      const user = userCred.user;
      if (user) {
        await this.saveUserData(user); // Store user data in Firestore
        console.log('User logged in:', user);
        localStorage.setItem('firebaseToken', await user.getIdToken());
        this.router.navigate(['/']); // Navigate to home or dashboard
      }
    });
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

  signUp({
    email,
    password,
    displayName,
    phone,
  }: {
    email: string;
    password: string;
    displayName: string;
    phone: string;
  }): void {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        const idToken = await user.getIdToken();

        // Store the token for later use (localStorage/sessionStorage)
        localStorage.setItem('firebaseToken', idToken);

        if (user) {
          await this.saveUserData({ ...user, phone }); // Save user data to Firestore
          console.log('User signed up:', user);
          localStorage.setItem('firebaseToken', await user.getIdToken());
          this.router.navigate(['/']); // Navigate to home or dashboard
        }
        updateProfile(user, {
          displayName,
        });
        return user;
      })
      .then((user) => {
        sendEmailVerification(user);
        return this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  // Save user data to Firestore
  private async saveUserData(user: any): Promise<void> {
    const userRef = doc(collection(this.firestore, 'users'), user.uid);
    const userData = {
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phone,
    };
    await setDoc(userRef, userData, { merge: true });
  }
}
