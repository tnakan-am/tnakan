import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { IUser } from '../interfaces/user.interface';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private readonly base = `${environment.apiUrl}/users`;

  getUserData(): Observable<IUser | undefined> {
    const cached = this.auth.currentUser();
    if (cached) return of(cached);
    return this.auth.refreshCurrentUser().pipe(switchMap((user) => of(user ?? undefined)));
  }

  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.base}/${id}`);
  }

  update(_user: IUser | null, data: Partial<IUser>): Observable<IUser> {
    return this.http
      .patch<IUser>(`${this.base}/me`, data)
      .pipe(tap((updated) => this.auth.currentUser.set(updated)));
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.base}/me/password`, {
      currentPassword,
      newPassword,
    });
  }

  changeEmail(currentPassword: string, newEmail: string): Observable<IUser> {
    return this.http
      .post<IUser>(`${this.base}/me/email`, { currentPassword, newEmail })
      .pipe(tap((updated) => this.auth.currentUser.set(updated)));
  }

  getUsersList(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.base);
  }

  getBusinesses(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.base}/businesses`);
  }
}
