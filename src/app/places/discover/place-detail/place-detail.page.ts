import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  placeSub: Subscription;
  bookable = false;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private placesService: PlacesService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;

      let userId: string;

      this.placeSub = this.authService.userId
        .pipe(
          take(1),
          switchMap(id => {
            if (!id) {
              throw new Error('Found no user');
            }

            userId = id;

            return this.placesService.getPlace(paramMap.get('placeId'));
          })
        )
        .subscribe(place => {
          this.place = place;
          this.bookable = userId !== place.userId;
          this.isLoading = false;
        });
    });
  }

  async bookPlace() {
    if (!this.bookable) {
      return;
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose an action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  openBookingModal(mode: 'select' | 'random') {
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode }
      })
      .then(modalEl => {
        modalEl.present();

        modalEl.onDidDismiss().then(result => {
          if (result.role === 'confirm') {
            this.loadingCtrl
              .create({
                message: 'Booking Place...'
              })
              .then(loadingEl => {
                loadingEl.present();

                const {
                  firstName,
                  lastName,
                  guestNumber,
                  startDate,
                  endDate
                } = result.data.bookingData;

                this.bookingService
                  .addBooking(
                    this.place.id,
                    this.place.title,
                    this.place.imageUrl,
                    firstName,
                    lastName,
                    guestNumber,
                    startDate,
                    endDate
                  )
                  .subscribe(
                    () => {
                      loadingEl.dismiss();
                      this.router.navigate(['/', 'places', 'tabs', 'discover']);
                    },
                    error => {
                      loadingEl.dismiss();

                      this.alertCtrl
                        .create({
                          header: 'An error ocurred!!',
                          message: error.message,
                          backdropDismiss: false,
                          buttons: ['Okay']
                        })
                        .then(alertEl => alertEl.present());
                    }
                  );
              });
          }
        });
      });
  }

  openPlace() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          title: this.place.location.address,
          center: { lat: this.place.location.lat, lng: this.place.location.lng }
        }
      })
      .then(modalEl => {
        modalEl.present();
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
