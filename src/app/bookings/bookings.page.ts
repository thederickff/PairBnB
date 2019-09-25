import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  bookingsSub: Subscription;
  isLoading: boolean;

  constructor(
    private loadingCtrl: LoadingController,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.bookingsSub = this.bookingService.bookings.subscribe(
      bookings => (this.loadedBookings = bookings)
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fectchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingCtrl
      .create({
        message: 'Canceling booking...'
      })
      .then(loadingEl => {
        loadingEl.present();

        this.bookingService.cancelBooking(bookingId).subscribe(() => {
          loadingEl.dismiss();
        });
      });
  }

  ngOnDestroy() {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }
}
