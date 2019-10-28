import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface AuthResponse {
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
  private mUserIsAuthenticated = false;
  private mUserId = null;

  get userIsAuthenticated() {
    return this.mUserIsAuthenticated;
  }

  get userId() {
    return this.mUserId;
  }

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
      { email, password, returnSecureToken: true }
    );
  }

  login() {
    this.mUserIsAuthenticated = true;
  }

  logout() {
    this.mUserIsAuthenticated = false;
  }
}
