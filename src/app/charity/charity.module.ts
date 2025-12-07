import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharityRoutingModule } from './charity-routing.module';
import { CharityComponent } from './charity.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CharityRoutingModule,
    FormsModule,
    SharedModule
  ],
  exports: []
})
export class CharityModule { }
