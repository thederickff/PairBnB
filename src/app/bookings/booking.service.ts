import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map, take, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface BookingData {
  dateFrom: string;
  dateTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImageUrl: string;
  placeTitle: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private mBookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get bookings() {
    return this.mBookings.asObservable();
  }

  fectchBookings() {
    let tokenId;

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        tokenId = token;

        return this.authService.userId;
      }),
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found');
        }

        return this.http.get<{ [key: string]: BookingData }>(
          `${environment.serverBaseUrl}/bookings.json?orderBy="userId"&equalTo="${userId}"&auth=${tokenId}`
        );
      }),
      map(response => {
        const bookings: Booking[] = [];

        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            bookings.push({
              id: key,
              placeId: response[key].placeId,
              userId: response[key].userId,
              placeTitle: response[key].placeTitle,
              placeImageUrl: response[key].placeImageUrl,
              firstName: response[key].firstName,
              lastName: response[key].lastName,
              guestNumber: response[key].guestNumber,
              dateFrom: new Date(response[key].dateFrom),
              dateTo: new Date(response[key].dateTo)
            });
          }
        }

        return bookings;
      }),
      tap(bookings => {
        this.mBookings.next(bookings);
      })
    );
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
    let tokenId;
    let booking;

    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user id found!');
        }

        booking = new Booking(
          null,
          placeId,
          userId,
          placeTitle,
          placeImageUrl,
          firstName,
          lastName,
          guestNumber,
          dateFrom,
          dateTo
        );

        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        tokenId = token;

        return this.fectchBookings();
      }),
      switchMap(bookings => {
        const index = bookings.findIndex(
          item =>
            item.userId === booking.userId && item.placeId === booking.placeId
        );

        if (index !== -1) {
          throw new Error('You already booked this place!!');
        }

        return this.http.post<{ name: string }>(
          `${environment.serverBaseUrl}/bookings.json?auth=${tokenId}`,
          booking
        );
      }),
      switchMap(res => {
        booking.id = res.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        this.mBookings.next(bookings.concat(booking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.delete(
          `${environment.serverBaseUrl}/bookings/${bookingId}.json?auth=${token}`
        );
      }),
      switchMap(() => this.bookings),
      take(1),
      tap(bookings => {
        this.mBookings.next(
          bookings.filter(booking => booking.id !== bookingId)
        );
      })
    );
  }
}
