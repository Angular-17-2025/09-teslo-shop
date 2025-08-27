import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { UserInterface } from '@auth/interfaces/user.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<UserInterface | null>(null);
  private _token = signal<string | null>(null);

  private http = inject(HttpClient);

  authStatus = computed<AuthStatus>(() => {
    if(this._authStatus() === 'checking') return 'checking';

    if(this._user()) return 'authenticated'

    return 'not-authenticated'
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

}
