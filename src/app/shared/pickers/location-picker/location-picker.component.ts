import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { Location, Coordinates } from 'src/app/places/location.model';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  ngOnInit() {}

  onPickLocation() {
    this.modalCtrl
      .create({
        component: MapModalComponent
      })
      .then(modalEl => {
        modalEl.present();

        modalEl.onDidDismiss().then(result => {
          if (result.role === 'success') {
            const location: Location = {
              lat: result.data.lat,
              lng: result.data.lng,
              address: null,
              imgUrl: null
            };

            this.getAddress(location)
              .pipe(
                switchMap(address => {
                  location.address = address;

                  return of(this.getMapImageUrl(location));
                })
              )
              .subscribe(imgUrl => {
                location.imgUrl = imgUrl;

                console.log(location);
              });
          }
        });
      });
  }

  private getAddress(location: Coordinates) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${environment.googleMapsApiKey}`
      )
      .pipe(
        map(response => {
          if (!response || !response.results || response.results.length === 0) {
            return null;
          }

          return response.results[0].formatted_address;
        })
      );
  }

  private getMapImageUrl(location: Location) {
    return `https://maps.googleapis.com/maps/api/staticmap?
    center=${location.lat},${location.lng}&zoom=13&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:L%7C${location.lat},${location.lng}
    &key=${environment.googleMapsApiKey}`;
  }
}
