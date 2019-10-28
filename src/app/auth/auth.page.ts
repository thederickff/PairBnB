import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponse } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async authenticate(email: string, password: string) {
    const loading = await this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Loggin in...'
    });
    loading.present();
    let authObs: Observable<AuthResponse>;

    if (this.isLogin) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe(
      resData => {
        loading.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
        console.log(resData);
      },
      errorRes => {
        loading.dismiss();
        const code = errorRes.error.error.message;

        let message = 'Please try again!';
        if (code === 'EMAIL_EXISTS') {
          message = 'This email address exists already!';
        } else if (code === 'EMAIL_NOT_FOUND') {
          message = 'E-Mail address could not be found.';
        } else if (code === 'INVALID_PASSWORD') {
          message = 'This password is not corrent.';
        }

        this.showAlert('Could not authenticate.', message);
      }
    );
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const { email, password } = form.value;

    this.authenticate(email, password);
  }

  private showAlert(header: string, message: string) {
    this.alertCtrl
      .create({ header, message, buttons: ['Ok'] })
      .then(alertEl => alertEl.present());
  }
}
