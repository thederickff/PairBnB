import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mUserIsAuthenticated = true;

  get userIsAuthenticated() {
    return this.mUserIsAuthenticated;
  }

  constructor() {}

  login() {
    this.mUserIsAuthenticated = true;
  }

  logout() {
    this.mUserIsAuthenticated = false;
  }
}
