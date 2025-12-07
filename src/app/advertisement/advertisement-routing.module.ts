// modulename-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdsPopupComponent } from './ads-popup/ads-popup.component';

const routes: Routes = [
    { path: 'adspopup', component: AdsPopupComponent }
    // Add more routes here
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdvertisementRoutingModule { }