import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginResponseInterface } from '@auth/interfaces/login-response.interface';
import { UserInterface } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<UserInterface | null>(null);
  private _token = signal<string | null>(null);

  private _http = inject(HttpClient);

  authStatus = computed<AuthStatus>(() => {
    if(this._authStatus() === 'checking') return 'checking';

    if(this._user()) return 'authenticated'

    return 'not-authenticated'
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean>{
    return this._http.post<LoginResponseInterface>('http://localhost:3000/api/auth/login', { email, password }).pipe(
      tap(resp => {
        this._user.set(resp.user);
        this._authStatus.set('authenticated');
        this._token.set(resp.token);

        localStorage.setItem('token', resp.token);
      }),
      map(() => true),
      catchError((error) => {
        console.log(error);
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('not-authenticated');
        localStorage.removeItem('token');
        return of(error);
      })
    );
  }

}
