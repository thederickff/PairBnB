import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit {
  loadedPlaces: Place[];

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.loadedPlaces = this.placesService.places2;
  }

  onEdit(placeId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', placeId]);
  }
}
