import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlashnewsRoutingModule } from './flashnews-routing.module';
import { FlashnewsComponent } from './flashnews.component';
import { UpipaymentModule } from "../upipayment/upipayment.module";


@NgModule({
  declarations: [FlashnewsComponent],
  imports: [
    CommonModule,
    FlashnewsRoutingModule,
    UpipaymentModule,
    UpipaymentModule
  ], exports: [FlashnewsComponent]
})
export class FlashnewsModule { }
