import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpipaymentComponent } from './upipayment.component';

const routes: Routes = [{ path: '', component: UpipaymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpipaymentRoutingModule { }
