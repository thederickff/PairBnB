import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Plugins } from '@capacitor/core';

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mUser = new BehaviorSubject<User>(null);

  get userIsAuthenticated() {
    return this.mUser.asObservable().pipe(map(user => user && !!user.token));
  }

  get userId() {
    return this.mUser.asObservable().pipe(map(user => (user ? user.id : null)));
  }

  constructor(private http: HttpClient) {}

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(authData => {
        if (!authData || !authData.value) {
          return null;
        }

        const parsedData = JSON.parse(authData.value) as {
          userId: string;
          email: string;
          token: string;
          tokenExpirationDate: string;
        };

        const expirationTime = new Date(parsedData.tokenExpirationDate);

        if (expirationTime <= new Date()) {
          return null;
        }

        return new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
      }),
      tap(user => {
        if (user) {
          this.mUser.next(user);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this.mUser.next(null);
    Plugins.Storage.remove({key: 'authData'});
  }

  private setUserData(userData: AuthResponse) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    this.mUser.next(
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
      )
    );

    this.storeAuthData(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime.toISOString()
    );
  }

  private storeAuthData(
    userId: string,
    email: string,
    token: string,
    tokenExpirationDate: string
  ) {
    const value = JSON.stringify({ userId, token, email, tokenExpirationDate });
    Plugins.Storage.set({ key: 'authData', value });
  }
}
