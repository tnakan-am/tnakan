import { inject, Injectable } from '@angular/core';
import { map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { collection, doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth, updateProfile, user, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  user$: Observable<User> = user(this.auth).pipe(shareReplay(1));

  constructor() {}

  // Save user data to Firestore
  async saveUserDataOnSignUp(user: IUser): Promise<void> {
    const userRef = doc(collection(this.firestore, 'users'), user.uid);
    const userData = {
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      type: user.type,
    };
    await setDoc(userRef, userData, { merge: true });
  }

  getUserData(): Observable<IUser | undefined> {
    return this.user$.pipe(
      switchMap((user) =>
        !!user?.uid
          ? fromPromise(getDoc(doc(collection(this.firestore, 'users'), (user as User)?.uid))).pipe(
              map((value) => (value.exists() ? value.data() : null) as IUser)
            )
          : of(undefined)
      ),
      shareReplay(1)
    );
  }

  update(user: User, data: Partial<IUser>) {
    let userData: any = {};
    if (data.image) {
      userData.photoURL = data.image;
    }
    if (data.displayName) {
      userData.displayName = data.displayName;
    }
    return fromPromise(
      (userData.photoURL || user.displayName
        ? updateProfile(user, userData)
        : Promise.resolve()
      ).then((value) => {
        return setDoc(doc(collection(this.firestore, 'users'), user.uid), data, { merge: true });
      })
    );
  }
}
