import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

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

  signUp(email: string, password: string) {
    return this.http.post<AuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
      { email, password, returnSecureToken: true }
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
      { email, password, returnSecureToken: true }
    );
  }

  logout() {
    this.mUser.next(null);
  }
}
