import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { catchError, filter, finalize } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

import { environment } from '../../../environments/environment';
import { IUser } from '../interfaces/user.interface';
import { TokenService } from './token.service';
import { openSnackBar } from '../helpers/snackbar';

interface LoginResponse {
  access_token: string;
  user: IUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private snackBar = openSnackBar();

  private readonly base = `${environment.apiUrl}/auth`;

  readonly currentUser = signal<IUser | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  readonly user$: Observable<IUser> = toObservable(this.currentUser).pipe(
    filter((u): u is IUser => u !== null)
  );

  private inflightMe: Observable<IUser | null> | null = null;

  constructor() {
    this.bootstrap();
  }

  private bootstrap(): void {
    if (!this.tokenService.get()) return;
    this.fetchMe().subscribe();
  }

  private fetchMe(): Observable<IUser | null> {
    if (this.inflightMe) return this.inflightMe;
    this.inflightMe = this.http.get<IUser>(`${environment.apiUrl}/users/me`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.tokenService.clear();
        this.currentUser.set(null);
        return of(null);
      }),
      finalize(() => (this.inflightMe = null)),
      shareReplay({ bufferSize: 1, refCount: false })
    );
    return this.inflightMe;
  }

  getCurrentUser(): IUser | null {
    return this.currentUser();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, { email, password }).pipe(
      tap((res) => {
        this.tokenService.set(res.access_token);
        this.currentUser.set(res.user);
        this.router.navigate(['/']);
      })
    );
  }

  signUp(formData: IUser): Observable<{ success: boolean; data: IUser; message: string }> {
    return this.http
      .post<{ success: boolean; data: IUser; message: string }>(`${this.base}/register`, formData)
      .pipe(
        tap((res) => {
          this.snackBar(res?.message || 'Registration successfully done, please verify your email');
          this.router.navigate(['/confirm-email']);
        })
      );
  }

  logout(): void {
    this.tokenService.clear();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  verifyEmail(token: string): Observable<{ success: boolean; data: IUser; message: string }> {
    return this.http.get<{ success: boolean; data: IUser; message: string }>(
      `${this.base}/verify-email`,
      { params: { token } }
    );
  }

  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.base}/forgot-password`, {
      email,
    });
  }

  resetPassword(token: string, password: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.base}/reset-password`, { token, password });
  }

  resendVerification(email: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.base}/resend-verification`, { email });
  }

  refreshCurrentUser(): Observable<IUser | null> {
    if (!this.tokenService.get()) {
      this.currentUser.set(null);
      return of(null);
    }
    return this.fetchMe();
  }
}
