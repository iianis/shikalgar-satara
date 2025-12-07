import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AchievementsRoutingModule } from './achievements-routing.module';
import { AchievementsComponent } from './achievements.component';


@NgModule({
  declarations: [AchievementsComponent],
  imports: [
    CommonModule,
    AchievementsRoutingModule
  ],
  exports: [AchievementsComponent]
})
export class AchievementsModule { }