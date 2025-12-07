import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectorsRoutingModule } from './directors-routing.module';
import { DirectorsComponent } from './directors.component';


@NgModule({
  declarations: [DirectorsComponent],
  imports: [
    CommonModule,
    DirectorsRoutingModule
  ],
  exports: [DirectorsComponent]
})
export class DirectorsModule { }
