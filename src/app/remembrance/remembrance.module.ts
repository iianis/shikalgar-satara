import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemembranceRoutingModule } from './remembrance-routing.module';
import { RemembranceComponent } from './remembrance.component';


@NgModule({
  declarations: [RemembranceComponent],
  imports: [
    CommonModule,
    RemembranceRoutingModule
  ],
  exports: [RemembranceComponent]
})
export class RemembranceModule { }
