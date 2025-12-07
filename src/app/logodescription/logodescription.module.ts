import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogodescriptionRoutingModule } from './logodescription-routing.module';
import { LogodescriptionComponent } from './logodescription.component';


@NgModule({
  declarations: [
    LogodescriptionComponent
  ],
  imports: [
    CommonModule,
    LogodescriptionRoutingModule
  ],
  exports: [
    LogodescriptionComponent
  ]
})
export class LogodescriptionModule { }
