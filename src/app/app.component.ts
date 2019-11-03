import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';

import { Plugins, Capacitor, AppState } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  private previousAuthState = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    this.subscription = this.authService.userIsAuthenticated.subscribe(
      isAuthenticated => {
        if (!isAuthenticated && this.previousAuthState !== isAuthenticated) {
          this.router.navigate(['/auth']);
        }

        this.previousAuthState = isAuthenticated;
      }
    );

    Plugins.App.addListener(
      'appStateChange',
      this.checkAuthOnResume.bind(this)
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
  }

  private checkAuthOnResume(state: AppState) {
    console.log('Resume?');
    if (state.isActive) {
      this.authService
        .autoLogin()
        .pipe(take(1))
        .subscribe(success => {
          if (!success) {
            this.onLogout();
          }
        });
    }
  }
}
