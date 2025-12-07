import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventslistRoutingModule } from './eventslist-routing.module';
import { EventslistComponent } from './eventslist.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EventslistRoutingModule,
    SharedModule
  ], exports: []
})
export class EventslistModule { }
