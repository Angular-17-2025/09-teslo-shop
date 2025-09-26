import { LoginResponseInterface } from './../interfaces/login-response.interface';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserInterface } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<UserInterface | null>(null);
  private _token = signal<string | null>(null);

  private _http = inject(HttpClient);

  private API_BASE_URL = environment.API_BASE_URL;

  checkStatus = rxResource({
    stream: () => this.checkLoginstatus()
  });

  authStatus = computed<AuthStatus>(() => {
    if(this._authStatus() === 'checking') return 'checking';

    if(this._user()) return 'authenticated'

    return 'not-authenticated'
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean>{
    return this._http.post<LoginResponseInterface>('http://localhost:3000/api/auth/login', { email, password }).pipe(
      map((resp) => this.handleSuccess(resp)),
      catchError((error) => this.handleError(error))
    );
  }

  checkLoginstatus(): Observable<boolean>{

    let token = localStorage.getItem('token');

    if(!token) {
      this.logout();
      return of(false);
    }

    return this._http.get<LoginResponseInterface>(`${this.API_BASE_URL}/auth/check-status`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      map((resp) => this.handleSuccess(resp)),
      catchError((error) => this.handleError(error))
    );
  }

  logout(){
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  private handleSuccess({token, user}: LoginResponseInterface) {

    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);
    localStorage.setItem('token', token);
    return true;
  }

  private handleError(error: any) {

    console.log(error);
    this.logout();
    return of(false);
  }

}
