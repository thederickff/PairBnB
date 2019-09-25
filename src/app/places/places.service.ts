import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private mPlaces = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    return this.mPlaces.asObservable();
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        `${environment.serverBaseUrl}/places.json`
      )
      .pipe(
        map(response => {
          const places = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  response[key].title,
                  response[key].description,
                  response[key].imageUrl,
                  response[key].price,
                  new Date(response[key].availableFrom),
                  new Date(response[key].availableTo),
                  response[key].userId
                )
              );
            }
          }

          return places;
        }),
        tap(places => {
          this.mPlaces.next(places);
        })
      );
  }

  getPlace(placeId: string) {
    return this.places.pipe(
      take(1),
      map(places => {
        return { ...places.find(place => place.id === placeId) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fgzbrokers.files.wordpress.com%2F2012%2F02%2Fnewyorkcity-realestate-night.jpg&f=1',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    return this.http
      .post<{ name: string }>(`${environment.serverBaseUrl}/places.json`, {
        ...newPlace,
        id: null
      })
      .pipe(
        switchMap(response => {
          newPlace.id = response.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          this.mPlaces.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];

    return this.places.pipe(
      take(1),
      switchMap(places => {
        const index = places.findIndex(place => place.id === placeId);
        places[index].title = title;
        places[index].description = description;

        updatedPlaces = places;

        return this.http.put(
          `${environment.serverBaseUrl}/places/${placeId}.json`,
          {
            ...places[index],
            id: null
          }
        );
      }),
      tap(() => {
        this.mPlaces.next(updatedPlaces);
      })
    );
  }
}
