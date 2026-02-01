import { LoginResponseInterface } from './../interfaces/login-response.interface';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserInterface } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<UserInterface | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private _http = inject(HttpClient);
  private API_BASE_URL = environment.API_BASE_URL;

  private _checkLoginStatus$?: Observable<boolean>;

  authStatus = computed<AuthStatus>(() => this._authStatus());
  user = computed(() => this._user());
  token = computed(() => this._token());

  checkStatus = rxResource({
    stream: () => this.checkLoginstatus()
  });

  login(email: string, password: string): Observable<boolean>{
    return this._http.post<LoginResponseInterface>(this.API_BASE_URL + '/auth/login', { email, password }).pipe(
      map((resp) => this.handleSuccess(resp)),
      catchError((error) => this.handleError(error))
    );
  }

  checkLoginstatus(): Observable<boolean>{

    const token = localStorage.getItem('token');
    const lifeToken = localStorage.getItem('cicle');
    const expToken = lifeToken ? Number(lifeToken) : 0;

    if(!token || !expToken || Date.now() > expToken) {
      this.logout();
      return of(false);
    }

    if(!this._checkLoginStatus$) {
      this._checkLoginStatus$ = this._http.get<LoginResponseInterface>(`${this.API_BASE_URL}/auth/check-status`, {
        headers: {
          // Authorization: `Bearer ${token}`
        }
      }).pipe(
        map((resp) => this.handleSuccess(resp)),
        catchError((error) => this.handleError(error)),
        shareReplay(1)
      );
    }
    return this._checkLoginStatus$;
  }

  logout(){
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    this._checkLoginStatus$ = undefined;

    localStorage.removeItem('token');
    localStorage.removeItem('cicle');
  }

  private handleSuccess({token, user}: LoginResponseInterface) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);
    const expiresInMs = 60 * 60 * 1000; //60mins
    const expTime = Date.now() + expiresInMs;

    localStorage.setItem('token', token);
    localStorage.setItem('cicle', expTime.toString());
    return true;
  }

  private handleError(error: any): Observable<boolean> {
    console.log(error);
    this.logout();
    return of(false);
  }

}
