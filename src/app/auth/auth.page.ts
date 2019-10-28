import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

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
    this.authService.login();
    const loading = await this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Loggin in...'
    });
    loading.present();

    this.authService.signUp(email, password).subscribe(
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
        }
        this.showAlert('Could not sign you up.', message);
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
