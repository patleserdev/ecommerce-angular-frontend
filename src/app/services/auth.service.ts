import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserType } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl; // ton backend

  private loggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn$.asObservable();


  private _role$ = new BehaviorSubject<string | null>(null);
  public get role$() {
    return this._role$.asObservable();
  }

  private userSubject = new BehaviorSubject<UserType | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`, credentials, {
      withCredentials: true, // nécessaire pour cookie HTTP-only
    }).pipe(
      tap((user) => {
        this.loggedIn$.next(true);

      }),
      catchError(() => {
        this.loggedIn$.next(false);
        return of(null);
      })
    );

  }

  register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/register`, credentials, {
      withCredentials: true, // nécessaire pour cookie HTTP-only
    });
  }

  // checkAuth(): Observable<boolean> {
  //   return this.http.get<boolean>(`${this.baseUrl}/users/check`, {
  //     withCredentials: true
  //   });
  // }

  checkAuth() {
    return this.http
      .get<{ role: string }>(`${this.baseUrl}/users/check`, {
        withCredentials: true, // nécessaire pour cookie HTTP-only
      })
      .pipe(
        tap((user) => {
          this.loggedIn$.next(true);
          this._role$.next(user.role);
        }),
        catchError(() => {
          this.loggedIn$.next(false);
          this._role$.next(null);
          return of(null);
        })
      );
  }

  logout() {
    return this.http
      .post(
        `${this.baseUrl}/users/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          this.loggedIn$.next(false);
          this._role$.next(null);
        }),
        catchError(() => {
          // En cas d'erreur logout, on peut forcer la déconnexion côté client
          this.loggedIn$.next(false);
          this._role$.next(null);
          return of(null);
        })
      );
  }

  fetchUserProfile() {
    return this.http
      .get<UserType>(`${this.baseUrl}/users/me`, { withCredentials: true })
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  get currentUser(): UserType | null {
    return this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'admin';
  }
}
