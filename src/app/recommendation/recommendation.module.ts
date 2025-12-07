import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecommendationRoutingModule } from './recommendation-routing.module';
import { RecommendationComponent } from './recommendation.component';


@NgModule({
  declarations: [
    RecommendationComponent
  ],
  imports: [
    CommonModule,
    RecommendationRoutingModule
  ],
  exports: [
    RecommendationComponent
  ]
})
export class RecommendationModule { }
