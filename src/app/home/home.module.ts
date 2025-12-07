import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LogoModule } from '../logo/logo.module';
import { SlideshowModule } from '../slideshow/slideshow.module';
import { LogodescriptionModule } from '../logodescription/logodescription.module';
import { MembersModule } from '../members/members.module';
import { EventsModule } from '../events/events.module';
import { RecommendationModule } from '../recommendation/recommendation.module';
import { ActivitiesModule } from '../activities/activities.module';
import { UpipaymentModule } from '../upipayment/upipayment.module';
import { FormsModule } from '@angular/forms';
import { AdvertisementModule } from '../advertisement/advertisement.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SlideshowModule,
    LogodescriptionModule,
    MembersModule,
    EventsModule,
    RecommendationModule,
    ActivitiesModule,
    UpipaymentModule,
    LogoModule,
    ActivitiesModule,
    FormsModule,
    AdvertisementModule
  ]
})
export class HomeModule { }
