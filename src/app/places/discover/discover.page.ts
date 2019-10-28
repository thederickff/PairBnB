import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
// import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  relevantPlaces: Place[];
  listedLoadedPlaces: Place[];
  filter = 'all';
  isLoading: boolean;
  private placesSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.onFilterUpdate(this.filter);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onFilterUpdate(filter: string) {
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (!userId) {
        return;
      }

      this.relevantPlaces = this.loadedPlaces.filter(
        place => filter === 'all' || place.userId !== userId
      );
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      this.filter = filter;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
