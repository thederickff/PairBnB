import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private mBookings: Booking[] = [
    {
      id: '001',
      placeId: '1',
      placeTitle: 'Mansion',
      userId: '1',
      guestNumber: 2
    }
  ];

  get bookings() {
    return [...this.mBookings];
  }
}
