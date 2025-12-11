import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { LogodescriptionModule } from '../logodescription/logodescription.module';
import { AnnouncementComponent } from './announcement.component';

@NgModule({
  declarations: [AnnouncementComponent],
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
    LogodescriptionModule,
  ]
})
export class AnnouncementModule { }
