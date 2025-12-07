import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberslistRoutingModule } from './memberslist-routing.module';
import { MemberslistComponent } from './memberslist.component';
import { SearchComponent } from '../search/search.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MemberslistComponent],
  imports: [
    CommonModule,
    MemberslistRoutingModule,
    SearchComponent,
    FormsModule
  ]
})
export class MemberslistModule { }
