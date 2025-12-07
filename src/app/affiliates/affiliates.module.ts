import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AffiliatesRoutingModule } from './affiliates-routing.module';
import { AffiliatesComponent } from './affiliates.component';


@NgModule({
  declarations: [AffiliatesComponent],
  imports: [
    CommonModule,
    AffiliatesRoutingModule
  ], exports: [AffiliatesComponent]
})
export class AffiliatesModule { }
