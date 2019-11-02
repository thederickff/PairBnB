import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
  ModalController,
  ActionSheetController,
  AlertController
} from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation, Coordinates } from 'src/app/places/location.model';
import { of } from 'rxjs';
import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Output() change = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  selectedLocationImageUrl: string;
  isLoading: boolean;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCtrl
      .create({
        header: 'Please Choose',
        buttons: [
          {
            text: 'Auto-Locate',
            handler: () => {
              this.locateUser();
            }
          },
          {
            text: 'Pick on Map',
            handler: () => {
              this.openMap();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      })
      .then(actionSheetRef => {
        actionSheetRef.present();
      });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();

      return;
    }

    Plugins.Geolocation.getCurrentPosition()
      .then(geoPosition => {
        this.createPlace(
          geoPosition.coords.latitude,
          geoPosition.coords.longitude
        );
      })
      .catch(() => {
        this.showErrorAlert();
      });
  }

  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick a location!',
        buttons: ['Ok']
      })
      .then(alertRef => {
        alertRef.present();
      });
  }

  private openMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          selectable: true,
          title: 'Pick a Location',
          buttonText: 'Cancel'
        }
      })
      .then(modalEl => {
        modalEl.present();

        modalEl.onDidDismiss().then(result => {
          if (result.role === 'success') {
            this.createPlace(result.data.lat, result.data.lng);
          }
        });
      });
  }

  private createPlace(lat: number, lng: number) {
    this.isLoading = true;

    const location: PlaceLocation = { lat, lng, address: null, imgUrl: null };

    this.getAddress(location)
      .pipe(
        switchMap(address => {
          location.address = address;

          return of(this.getMapImageUrl(location));
        })
      )
      .subscribe(imgUrl => {
        location.imgUrl = imgUrl;

        this.selectedLocationImageUrl = imgUrl;
        this.isLoading = false;
        this.change.emit(location);
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

  private getMapImageUrl(location: Coordinates) {
    return `https://maps.googleapis.com/maps/api/staticmap?
    center=${location.lat},${location.lng}&zoom=16&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:L%7C${location.lat},${location.lng}
    &key=${environment.googleMapsApiKey}`;
  }
}
