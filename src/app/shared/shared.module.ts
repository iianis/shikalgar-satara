import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MembernewComponent } from '../membersnew/membersnew.component'; // Correct import path
import { RequestsComponent } from '../requests/requests.component';
import { EventsDataCollectorComponent } from '../eventsdatacollector/eventsdatacollector.component';
import { AffiliatesComponent } from '../affiliates/affiliates.component';
import { AboutusComponent } from '../aboutus/aboutus.component';
import { AdsPopupComponent } from '../advertisement/ads-popup/ads-popup.component';
import { AnnouncementComponent } from '../announcement/announcement.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { ActivitiesRoutingModule } from '../activities/activities-routing.module';
import { DirectorsModule } from '../directors/directors.module';
import { EducationModule } from '../education/education.module';
import { InitiativesModule } from '../initiatives/initiatives.module';
import { DonorsModule } from '../donors/donors.module';
import { RemembranceModule } from '../remembrance/remembrance.module';
import { MemberslistModule } from '../memberslist/memberslist.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { VerificationModule } from '../verification/verification.module';

@NgModule({
  declarations: [
    //MembernewComponent,
    RequestsComponent,
    //EventsDataCollectorComponent,
    //AffiliatesComponent,
    //AboutusComponent,
    AdsPopupComponent,
    AnnouncementComponent,
    //GalleryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ActivitiesRoutingModule,
    DirectorsModule,
    EducationModule,
    InitiativesModule,
    DonorsModule,
    RemembranceModule,
    MemberslistModule,
    AchievementsModule,
    VerificationModule
  ], // Add FormsModule here
  exports: [
    //MembernewComponent,
    RequestsComponent,
    //EventsDataCollectorComponent,
    //AffiliatesComponent,
    //AboutusComponent,
    AdsPopupComponent,
    //GalleryComponent
  ]
})
export class SharedModule { }
