import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @ViewChild('map', null) mapElement: ElementRef;

  constructor(private modalCtrl: ModalController, private renderer: Renderer2) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.getGoogleMaps()
      .then(googleMaps => {
        const mapEl = this.mapElement.nativeElement;

        const map = new googleMaps.Map(mapEl, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 16
        });

        googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;

    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const apiKey = environment.googleMapsApiKey;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;

        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Maps SDK not available');
        }
      };
    });
  }
}
