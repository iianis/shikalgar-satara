import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivitiesComponent } from './activities.component';
import { DirectorsModule } from '../directors/directors.module';
import { EducationModule } from '../education/education.module';
import { DonorsModule } from '../donors/donors.module';
import { RemembranceModule } from '../remembrance/remembrance.module';
import { MemberslistModule } from '../memberslist/memberslist.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { VerificationModule } from '../verification/verification.module';
import { InitiativesModule } from '../initiatives/initiatives.module';
//import { GalleryComponent } from '../gallery/gallery.component';
import { AffiliatesModule } from '../affiliates/affiliates.module';
//import { SharedModule } from '../shared/shared.module';
import { AboutusModule } from '../aboutus/aboutus.module';
import { GalleryModule } from '../gallery/gallery.module';


@NgModule({
  declarations: [
    ActivitiesComponent,
  ],
  imports: [
    CommonModule,
    AboutusModule,
    ActivitiesRoutingModule,
    DirectorsModule,
    EducationModule,
    DonorsModule,
    RemembranceModule,
    AboutusModule,
    MemberslistModule,
    AchievementsModule,
    VerificationModule,
    InitiativesModule,
    AffiliatesModule,
    GalleryModule
  ],
  exports: [
    ActivitiesComponent,
  ]
})
export class ActivitiesModule {
}
