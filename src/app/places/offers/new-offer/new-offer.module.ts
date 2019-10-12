import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewOfferPage } from './new-offer.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: NewOfferPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [NewOfferPage]
})
export class NewOfferPageModule {}
