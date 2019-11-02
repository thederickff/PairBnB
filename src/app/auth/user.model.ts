export class User {
  constructor(
    public id: string,
    public email: string,
    private mToken: string,
    private tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }

    return this.mToken;
  }

  get tokenExpiration() {
    if (!this.token) {
      return 0;
    }

    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}
