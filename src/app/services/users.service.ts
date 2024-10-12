import { inject, Injectable } from '@angular/core';
import { map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { collection, doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { updateProfile, User } from '@angular/fire/auth';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  firebaseAuthService = inject(FirebaseAuthService);
  firestore = inject(Firestore);

  constructor() {}

  getUserData(): Observable<IUser | undefined> {
    const user = this.firebaseAuthService.user$;
    return user.pipe(
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
