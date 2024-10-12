import { inject, Injectable } from '@angular/core';
import { map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
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
}
