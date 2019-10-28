import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  loading = false;
  private placesSub: Subscription;

  constructor(
    private authService: AuthService,
    private placesService: PlacesService,
    private router: Router
  ) {}

  ngOnInit() {
    let userId: string;

    this.authService.userId.pipe(take(1), switchMap(id => {
      if (!id) {
        throw new Error('User not found');
      }

      userId = id;

      return this.placesService.places;
    }))
    .subscribe(places => {
      this.loadedPlaces = places.filter(
        place => place.userId === userId
      );
    });
  }

  ionViewWillEnter() {
    this.loading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.loading = false;
    });
  }

  onEdit(placeId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', placeId]);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
