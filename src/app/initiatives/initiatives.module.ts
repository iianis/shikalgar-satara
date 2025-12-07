import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitiativesRoutingModule } from './initiatives-routing.module';
import { InitiativesComponent } from './initiatives.component';


@NgModule({
  declarations: [InitiativesComponent],
  imports: [
    CommonModule,
    InitiativesRoutingModule
  ],
  exports: [InitiativesComponent]
})
export class InitiativesModule { }
