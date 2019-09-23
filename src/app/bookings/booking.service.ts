import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, delay, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private mBookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService) {}

  get bookings() {
    return this.mBookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImageUrl: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const booking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImageUrl,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );

    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this.mBookings.next(bookings.concat(booking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this.mBookings.next(
          bookings.filter(booking => booking.id !== bookingId)
        );
      })
    );
  }
}
