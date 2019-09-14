import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private mPlaces: Place[] = [
    new Place(
      '1',
      'Manhattan Mansion',
      'In the heart of New York Ciry',
      'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fgzbrokers.files.wordpress.com%2F2012%2F02%2Fnewyorkcity-realestate-night.jpg&f=1',
      149.99,
      new Date('2019-09-14'),
      new Date('2019-09-20')
    ),
    new Place(
      '2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fs-ec.bstatic.com%2Fimages%2Fhotel%2Fmax1024x768%2F696%2F69653904.jpg&f=1',
      189.99,
      new Date('2019-09-16'),
      new Date('2019-09-22')
    ),
    new Place(
      '3',
      'The DK Osten Ved',
      'Not your average city trip!',
      'https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fjohnrieber.files.wordpress.com%2F2014%2F01%2Fcopenhagen-harbor-denmark.jpg&f=1',
      119.99,
      new Date('2019-09-15'),
      new Date('2019-09-20')
    )
  ];

  private mPlaces2: Place[] = [
    new Place(
      '4',
      'Gran Hotel Ciudad De Mexico',
      '60 smoke-free guestrooms, Restaurant and 2 restaurants and Rooftop terrace',
      'https://thumbnails.trvl-media.com/_1zvG_S5crNfs1YLEIF1pDZLgLw=/582x388/smart/' +
        'filters:quality(60)/exp.cdn-hotels.com/hotels/1000000/30000/21400/21358/ca08b544_z.jpg',
      179.99,
      new Date('2019-09-18'),
      new Date('2019-09-22')
    ),
    new Place(
      '5',
      'Barceló México Reforma',
      'Luxury hotel with 3 restaurants, near Teatro Metropólitan',
      'https://thumbnails.trvl-media.com/0ydepJNDssbrZpnEfbuIfdAuB-4=/582x388/smart/' +
        'filters:quality(60)/exp.cdn-hotels.com/hotels/1000000/30000/25800/25798/58952a54_z.jpg',
      95.99,
      new Date('2019-09-19'),
      new Date('2019-09-29')
    ),
    new Place(
      '6',
      'NH Collection Mexico City Centro Histórico',
      '4-star hotel with restaurant, near Plaza de la Constitucion.',
      'https://thumbnails.trvl-media.com/ckH8tk4raeUF8mUKE9P7jCIfUMs=/582x388/smart/' +
        'filters:quality(60)/exp.cdn-hotels.com/hotels/2000000/1360000/1354000/1353939/d8d86787_z.jpg',
      107.99,
      new Date('2019-10-01'),
      new Date('2019-10-14')
    )
  ];

  constructor() {}

  get places() {
    return [...this.mPlaces];
  }

  get places2() {
    return [...this.mPlaces2];
  }

  getPlace(placeId: string): Place {
    return { ...this.mPlaces.find(place => place.id === placeId) };
  }

  getPlace2(placeId: string): Place {
    return { ...this.mPlaces2.find(place => place.id === placeId) };
  }
}
