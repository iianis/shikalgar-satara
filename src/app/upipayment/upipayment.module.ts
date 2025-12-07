import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpipaymentRoutingModule } from './upipayment-routing.module';
import { UpipaymentComponent } from './upipayment.component';


@NgModule({
  declarations: [
    UpipaymentComponent
  ],
  imports: [
    CommonModule,
    UpipaymentRoutingModule
  ],
  exports: [
    UpipaymentComponent
  ]
})
export class UpipaymentModule { }
