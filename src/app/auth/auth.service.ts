import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mUserIsAuthenticated = true;
  private mUserId = 'user01';

  get userIsAuthenticated() {
    return this.mUserIsAuthenticated;
  }

  get userId() {
    return this.mUserId;
  }

  constructor() {}

  login() {
    this.mUserIsAuthenticated = true;
  }

  logout() {
    this.mUserIsAuthenticated = false;
  }
}
