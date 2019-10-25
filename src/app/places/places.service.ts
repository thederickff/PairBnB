import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PlaceLocation } from './location.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
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
                  response[key].userId,
                  response[key].location
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
    return this.http
      .get<PlaceData>(`${environment.serverBaseUrl}/places/${placeId}.json`)
      .pipe(
        map(place => {
          return new Place(
            placeId,
            place.title,
            place.description,
            place.imageUrl,
            place.price,
            new Date(place.availableFrom),
            new Date(place.availableTo),
            place.userId,
            place.location
          );
        })
      );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{ imageUrl: string; imagePath: string }>(
      `${environment.uploadImageCloudFunctionUrl}`,
      uploadData
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string,
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      imageUrl,
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
      location
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
        if (!places || places.length === 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
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
