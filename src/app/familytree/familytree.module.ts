import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FamilytreeRoutingModule } from './familytree-routing.module';
import { NgxOrgChartComponent } from '@ahmedaoui/ngx-org-chart';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FamilytreeRoutingModule,
    NgxOrgChartComponent
  ]
})
export class FamilytreeModule { }
