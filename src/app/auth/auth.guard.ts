import { Injectable } from '@angular/core';
import { Route, UrlSegment, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }
}
