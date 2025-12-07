import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonorsRoutingModule } from './donors-routing.module';
import { DonorsComponent } from './donors.component';
import { SearchComponent } from '../search/search.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [DonorsComponent],
  imports: [
    CommonModule,
    DonorsRoutingModule,
    SearchComponent,
    FormsModule
  ], exports: [DonorsComponent]
})
export class DonorsModule { }
