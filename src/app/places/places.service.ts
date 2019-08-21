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
      149.99
    ),
    new Place(
      '2',
      'L\'Amour Toujours',
      'A romantic place in Paris!',
      'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fs-ec.bstatic.com%2Fimages%2Fhotel%2Fmax1024x768%2F696%2F69653904.jpg&f=1',
      189.99
    ),
    new Place(
      '3',
      'The DK Osten Ved',
      'Not your average city trip!',
      'https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fjohnrieber.files.wordpress.com%2F2014%2F01%2Fcopenhagen-harbor-denmark.jpg&f=1',
      119.99
    )
  ];

  get places() {
    return [...this.mPlaces];
  }

  constructor() {}
}
