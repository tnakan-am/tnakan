import { inject, Injectable } from '@angular/core';
import { filter, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { IUser, Type } from '../interfaces/user.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { Firestore } from '@angular/fire/firestore';
import { Auth, updateEmail, updatePassword, updateProfile, User, user } from '@angular/fire/auth';
//  👉  use the Firebase JS SDK functions instead of the AngularFire wrappers
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  user$: Observable<User> = user(this.auth).pipe(
    filter((user): user is User => user !== null),
    shareReplay(1)
  );

  constructor() {}

  // Save user data to Firestore
  async saveUserDataOnSignUp(user: IUser): Promise<void> {
    const userRef = doc(collection(this.firestore, 'users'), user.uid);
    const userData: any = {
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      type: user.type,
    };
    if (user.type === Type.CUSTOMER) {
      userData.name = user.name;
      userData.surname = user.surname;
    } else {
      userData.company = user.company;
      userData.hvhh = user.hvhh;
    }
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

  getUserById(id: string): Observable<IUser> {
    return fromPromise(getDoc(doc(collection(this.firestore, 'users'), id))).pipe(
      map((value) => (value.exists() ? { uid: value.id, ...value.data() } : null) as IUser)
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
      ).then(async () => {
        if (data.email !== userData.email) {
          await updateEmail(user, data.email!);
        }
        return setDoc(doc(collection(this.firestore, 'users'), user.uid), data, { merge: true });
      })
    );
  }

  updatePassword(user: User, password: string) {
    return fromPromise(updatePassword(user, password)).pipe();
  }

  getUsersList(): Observable<IUser[]> {
    const usersRef = collection(this.firestore, 'users');
    return fromPromise(
      getDocs(usersRef).then((querySnapshot) => {
        return querySnapshot.docs.map((docSnam) => {
          return { uid: docSnam.id, ...docSnam.data() } as IUser;
        });
      })
    );
  }
}
