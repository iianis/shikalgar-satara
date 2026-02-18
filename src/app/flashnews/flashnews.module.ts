import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlashnewsRoutingModule } from './flashnews-routing.module';
import { FlashnewsComponent } from './flashnews.component';


@NgModule({
  declarations: [FlashnewsComponent],
  imports: [
    CommonModule,
    FlashnewsRoutingModule
  ], exports: [FlashnewsComponent]
})
export class FlashnewsModule { }
